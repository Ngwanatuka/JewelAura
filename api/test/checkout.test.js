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
      create: jest.fn().mockResolvedValue({ id: 'ch_123' })
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

describe('Checkout Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/checkout', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return error for empty cart', async () => {
      const Cart = require('../models/Cart.js');
      Cart.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/checkout')
        .send({
          userId: 'user123',
          address: { street: '123 Main St' },
          tokenId: 'tok_123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cart is empty');
    });
  });
});