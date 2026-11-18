import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import LoyaltyPoints from '../models/LoyaltyPoints.js';
import { sendEmail } from '../services/emailService.js';
import { POINTS_CONFIG } from './loyalty.js';
import { verifyToken } from './verifyToken.js';

const router = express.Router();

const YOCO_API_URL = 'https://payments.yoco.com/api';

// Create checkout session (authenticated)
router.post('/create-checkout', verifyToken, async (req, res) => {
    try {
        const { userId, address, cart: requestCart } = req.body;

        if (!userId || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You are not allowed to create a checkout for another user' });
        }

        let cart;
        if (requestCart && requestCart.products && requestCart.products.length > 0) {
            cart = requestCart;
        } else {
            cart = await Cart.findOne({ userId });
        }

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Recalculate authoritative prices from Product catalog when product IDs are present
        let authoritativeTotal = 0;
        const verifiedProducts = [];

        for (const item of cart.products) {
            const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
            const productId = item.productId || item._id;
            let unitPrice = Number(item.price);
            let title = item.title || 'Product';

            if (productId && typeof Product?.findById === 'function') {
                const dbProduct = await Product.findById(productId);
                if (dbProduct) {
                    unitPrice = Number(dbProduct.price);
                    title = dbProduct.title || title;
                }
            }

            if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                return res.status(400).json({ error: `Invalid product price for ${title}` });
            }

            authoritativeTotal += unitPrice * qty;
            verifiedProducts.push({
                ...item,
                title,
                price: unitPrice,
                quantity: qty,
            });
        }

        // Create order with server-calculated total
        const order = new Order({
            userId,
            products: verifiedProducts,
            amount: authoritativeTotal,
            address,
            status: 'pending',
            deliveryStatus: 'processing',
        });

        await order.save();

        // Create Yoco checkout session
        const checkoutData = {
            amount: Math.round(authoritativeTotal * 100), // Amount in cents
            currency: 'ZAR',
            successUrl: `${process.env.FRONTEND_URL}/success?orderId=${order._id}`,
            cancelUrl: `${process.env.FRONTEND_URL}/cart`,
            failureUrl: `${process.env.FRONTEND_URL}/cart?error=payment_failed`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId,
            },
            lineItems: verifiedProducts.map(item => ({
                displayName: item.title,
                quantity: item.quantity,
                pricingDetails: {
                    price: Math.round(item.price * 100),
                },
            })),
        };

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
        const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;
        if (webhookSecret) {
            const signature = req.headers['x-yoco-signature'] || req.headers['webhook-signature'];
            if (!signature) {
                return res.status(401).send('Missing signature');
            }
            const expected = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');
            const sigBuf = Buffer.from(String(signature));
            const expBuf = Buffer.from(expected);
            if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
                return res.status(401).send('Invalid signature');
            }
        }

        const event = req.body;

        if (event.type === 'payment.succeeded') {
            const orderId = event.payload?.metadata?.orderId;
            const userId = event.payload?.metadata?.userId;

            if (!orderId || !userId) {
                return res.status(400).send('Missing metadata');
            }

            const order = await Order.findById(orderId);
            if (order) {
                // Idempotency guard: avoid double-awarding points on webhook retries
                if (order.status === 'completed') {
                    return res.status(200).send('OK');
                }

                order.status = 'completed';
                await order.save();

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

                await Cart.findOneAndDelete({ userId });

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

// Verify payment status (authenticated)
router.get('/verify/:orderId', verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json({
            success: true,
            orderId: order._id,
            status: order.status,
            amount: order.amount,
            products: order.products,
            address: order.address,
            deliveryStatus: order.deliveryStatus,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery,
            createdAt: order.createdAt,
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
