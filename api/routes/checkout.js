import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

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
      status: 'pending'
    });

    await order.save();

    // Process payment
    const charge = await stripe.charges.create({
      source: tokenId,
      amount: (cart.total || 100) * 100,
      currency: 'usd'
    });

    // Update order status
    order.status = 'completed';
    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ 
      success: true, 
      orderId: order._id,
      chargeId: charge.id 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;