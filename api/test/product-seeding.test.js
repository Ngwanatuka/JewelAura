import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/product.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Mock Product model
jest.mock('../models/Product.js', () => ({
  find: jest.fn(),
  create: jest.fn()
}));

describe('Product Seeding', () => {
  it('should return products when they exist', async () => {
    const Product = require('../models/Product.js');
    
    Product.find.mockResolvedValue([
      { title: 'Gold Bracelet', price: 299 },
      { title: 'Purple Bracelet', price: 199 }
    ]);

    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should handle empty products gracefully', async () => {
    const Product = require('../models/Product.js');
    
    Product.find.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});