import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import LoyaltyPoints from '../models/LoyaltyPoints.js';
import { sendEmail } from '../services/emailService.js';
import { POINTS_CONFIG } from './loyalty.js';

const router = express.Router();

// PayFast configuration
const getPayFastUrl = () => {
    return process.env.PAYFAST_MODE === 'live'
        ? 'https://www.payfast.co.za/eng/process'
        : 'https://sandbox.payfast.co.za/eng/process';
};

// Generate PayFast signature
const generateSignature = (data, passPhrase = null) => {
    let pfOutput = '';
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key] !== '') {
                pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
            }
        }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
        getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
    }

    return crypto.createHash('md5').update(getString).digest('hex');
};

// Initiate payment
router.post('/initiate', async (req, res) => {
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

        // Prepare PayFast payment data
        const paymentData = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
            notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payfast/notify`,
            name_first: address.firstName || 'Customer',
            name_last: address.lastName || '',
            email_address: userId, // You should pass actual email
            m_payment_id: order._id.toString(),
            amount: (cart.total || 100).toFixed(2),
            item_name: `Order #${order._id.toString().slice(-8).toUpperCase()}`,
            item_description: `JewelAura Order - ${cart.products.length} items`,
            custom_str1: userId,
            custom_str2: order._id.toString(),
        };

        // Generate signature
        const signature = generateSignature(paymentData, process.env.PAYFAST_PASSPHRASE);
        paymentData.signature = signature;

        // Return payment data and URL
        res.status(200).json({
            success: true,
            orderId: order._id,
            paymentUrl: getPayFastUrl(),
            paymentData,
        });

    } catch (error) {
        console.error('PayFast initiate error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PayFast ITN (Instant Transaction Notification) webhook
router.post('/notify', async (req, res) => {
    try {
        const pfData = req.body;

        // Verify signature
        const pfParamString = Object.keys(pfData)
            .filter(key => key !== 'signature')
            .map(key => `${key}=${encodeURIComponent(pfData[key].toString().trim()).replace(/%20/g, '+')}`)
            .join('&');

        const pfPassphrase = process.env.PAYFAST_PASSPHRASE;
        const checkString = pfPassphrase ? `${pfParamString}&passphrase=${encodeURIComponent(pfPassphrase.trim()).replace(/%20/g, '+')}` : pfParamString;
        const calculatedSignature = crypto.createHash('md5').update(checkString).digest('hex');

        if (calculatedSignature !== pfData.signature) {
            console.error('Invalid signature');
            return res.status(400).send('Invalid signature');
        }

        // Verify payment status
        if (pfData.payment_status === 'COMPLETE') {
            const orderId = pfData.custom_str2;
            const userId = pfData.custom_str1;

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
        console.error('PayFast notify error:', error);
        res.status(500).send('Error');
    }
});

// Verify payment status (for frontend polling)
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
