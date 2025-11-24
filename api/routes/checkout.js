import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import LoyaltyPoints from '../models/LoyaltyPoints.js';
import { sendEmail } from '../services/emailService.js';
import { POINTS_CONFIG } from './loyalty.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post('/', async (req, res) => {
  try {
    const { userId, address, tokenId } = req.body;

    if (!userId || !address || !tokenId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create order
    const order = new Order({
      userId,
      products: cart.products,
      amount: cart.total || 100,
      address,
      status: 'pending',
      deliveryStatus: 'processing',
    });

    await order.save();

    // Process payment
    const charge = await stripe.charges.create({
      source: tokenId,
      amount: (cart.total || 100) * 100,
      currency: 'zar'
    });

    // Update order status
    order.status = 'completed';
    await order.save();

    // Award loyalty points
    const pointsEarned = Math.floor((cart.total || 100) * POINTS_CONFIG.pointsPerDollar);
    let loyalty = await LoyaltyPoints.findOne({ userId });

    if (!loyalty) {
      loyalty = new LoyaltyPoints({ userId });
    }

    loyalty.addTransaction(
      'earned',
      pointsEarned,
      `Order #${order._id.toString().slice(-8).toUpperCase()}`,
      order._id.toString()
    );
    await loyalty.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId });

    // Send order confirmation email
    try {
      await sendEmail(userId, 'orderConfirmation', {
        order,
        user: { username: 'Customer' },
      });

      // Send loyalty points notification
      await sendEmail(userId, 'loyaltyPointsEarned', {
        points: pointsEarned,
        user: { username: 'Customer' },
        totalPoints: loyalty.points,
      });
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
    }

    res.status(200).json({
      success: true,
      orderId: order._id,
      chargeId: charge.id,
      pointsEarned,
      totalPoints: loyalty.points,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;