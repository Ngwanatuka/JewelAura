import request from 'supertest';
import express from 'express';
import yocoRoute from '../routes/yoco.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock models
jest.mock('../models/Cart.js', () => ({
    findOne: jest.fn(),
    findOneAndDelete: jest.fn()
}));

jest.mock('../models/Order.js', () => {
    const mockSave = jest.fn().mockResolvedValue();
    return jest.fn().mockImplementation(() => ({
        save: mockSave,
        _id: 'order123',
        status: 'pending',
        amount: 100
    }));
});

jest.mock('../models/LoyaltyPoints.js', () => {
    const mockSave = jest.fn().mockResolvedValue();
    return jest.fn().mockImplementation(() => ({
        save: mockSave,
        addTransaction: jest.fn(),
        points: 100
    }));
});

jest.mock('../services/emailService.js', () => ({
    sendEmail: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(express.json());
app.use('/api/yoco', yocoRoute);

describe('Yoco Payment Gateway', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.YOCO_SECRET_KEY = 'sk_test_mock';
        process.env.FRONTEND_URL = 'http://localhost:3000';
    });

    describe('POST /api/yoco/create-checkout', () => {
        it('should create a checkout session successfully', async () => {
            const Cart = require('../models/Cart.js');
            Cart.findOne.mockResolvedValue({
                userId: 'user123',
                products: [{ title: 'Test Product', price: 100, quantity: 1 }],
                total: 100
            });

            axios.post.mockResolvedValue({
                data: {
                    id: 'checkout_123',
                    redirectUrl: 'https://pay.yoco.com/checkout/123'
                }
            });

            const response = await request(app)
                .post('/api/yoco/create-checkout')
                .send({
                    userId: 'user123',
                    address: { street: '123 Test St' }
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.checkoutUrl).toBe('https://pay.yoco.com/checkout/123');
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('https://payments.yoco.com/api/checkouts'),
                expect.objectContaining({
                    amount: 10000, // 100 * 100 cents
                    currency: 'ZAR'
                }),
                expect.any(Object)
            );
        });

        it('should return 400 if cart is empty', async () => {
            const Cart = require('../models/Cart.js');
            Cart.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/yoco/create-checkout')
                .send({
                    userId: 'user123',
                    address: { street: '123 Test St' }
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Cart is empty');
        });
    });
});
