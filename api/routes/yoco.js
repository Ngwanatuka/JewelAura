import express from 'express';
import axios from 'axios';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import LoyaltyPoints from '../models/LoyaltyPoints.js';
import { sendEmail } from '../services/emailService.js';
import { POINTS_CONFIG } from './loyalty.js';

const router = express.Router();

// Yoco API configuration
const YOCO_API_URL = process.env.YOCO_MODE === 'live'
    ? 'https://online.yoco.com/v1'
    : 'https://online.yoco.com/v1'; // Yoco uses same URL for both

// Create checkout session
router.post('/create-checkout', async (req, res) => {
    try {
        const { userId, address } = req.body;

        if (!userId || !address) {
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

        // Create Yoco checkout session
        const checkoutData = {
            amount: Math.round((cart.total || 100) * 100), // Amount in cents
            currency: 'ZAR',
            successUrl: `${process.env.FRONTEND_URL}/success?orderId=${order._id}`,
            cancelUrl: `${process.env.FRONTEND_URL}/cart`,
            failureUrl: `${process.env.FRONTEND_URL}/cart?error=payment_failed`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId,
            },
            lineItems: cart.products.map(item => ({
                displayName: item.title || 'Product',
                quantity: item.quantity,
                pricingDetails: {
                    price: Math.round(item.price * 100), // Price in cents
                },
            })),
        };

        // Call Yoco API to create checkout
        const response = await axios.post(
            `${YOCO_API_URL}/checkouts`,
            checkoutData,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({
            success: true,
            orderId: order._id,
            checkoutUrl: response.data.redirectUrl,
            checkoutId: response.data.id,
        });

    } catch (error) {
        console.error('Yoco checkout error:', error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data?.message || error.message
        });
    }
});

// Webhook endpoint for Yoco payment notifications
router.post('/webhook', async (req, res) => {
    try {
        const event = req.body;

        // Verify webhook signature (recommended for production)
        const signature = req.headers['x-yoco-signature'];

        // Handle different event types
        if (event.type === 'payment.succeeded') {
            const orderId = event.payload.metadata.orderId;
            const userId = event.payload.metadata.userId;

            // Update order
            const order = await Order.findById(orderId);
            if (order) {
                order.status = 'completed';
                await order.save();

                // Award loyalty points
                const pointsEarned = Math.floor(order.amount * POINTS_CONFIG.pointsPerDollar);
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

                // Send confirmation emails
                try {
                    await sendEmail(userId, 'orderConfirmation', {
                        order,
                        user: { username: 'Customer' },
                    });

                    await sendEmail(userId, 'loyaltyPointsEarned', {
                        points: pointsEarned,
                        user: { username: 'Customer' },
                        totalPoints: loyalty.points,
                    });
                } catch (emailError) {
                    console.error('Failed to send emails:', emailError);
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Yoco webhook error:', error);
        res.status(500).send('Error');
    }
});

// Verify payment status
router.get('/verify/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            orderId: order._id,
            status: order.status,
            amount: order.amount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
