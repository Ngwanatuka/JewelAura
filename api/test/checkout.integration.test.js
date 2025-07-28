import request from 'supertest';
import express from 'express';
import checkoutRoute from '../routes/checkout.js';

const app = express();
app.use(express.json());
app.use('/api/checkout', checkoutRoute);

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      create: jest.fn().mockResolvedValue({ id: 'ch_123', status: 'succeeded' })
    }
  }));
});

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
    status: 'pending'
  }));
});

describe('Checkout Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full checkout process', async () => {
    const Cart = require('../models/Cart.js');
    const Order = require('../models/Order.js');
    
    Cart.findOne.mockResolvedValue({
      userId: 'user123',
      products: [{ productId: 'prod1', quantity: 2 }],
      total: 100
    });
    Cart.findOneAndDelete.mockResolvedValue();

    const response = await request(app)
      .post('/api/checkout')
      .send({
        userId: 'user123',
        address: { street: '123 Main St', city: 'Test City' },
        tokenId: 'tok_123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.orderId).toBe('order123');
  });
});