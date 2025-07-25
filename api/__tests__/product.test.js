import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productRoutes from '../routes/product.js';
import Product from '../models/Product.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const product1 = new Product({
        title: 'Diamond Ring',
        desc: 'Beautiful diamond ring',
        img: 'ring.jpg',
        categories: ['rings'],
        size: ['M'],
        color: ['gold'],
        price: 1000
      });
      
      const product2 = new Product({
        title: 'Gold Necklace',
        desc: 'Elegant gold necklace',
        img: 'necklace.jpg',
        categories: ['necklaces'],
        size: ['L'],
        color: ['gold'],
        price: 800
      });

      await product1.save();
      await product2.save();

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Diamond Ring');
      expect(response.body[1].title).toBe('Gold Necklace');
    });

    it('should filter products by category', async () => {
      const product1 = new Product({
        title: 'Diamond Ring',
        desc: 'Beautiful diamond ring',
        img: 'ring.jpg',
        categories: ['rings'],
        size: ['M'],
        color: ['gold'],
        price: 1000
      });
      
      const product2 = new Product({
        title: 'Gold Necklace',
        desc: 'Elegant gold necklace',
        img: 'necklace.jpg',
        categories: ['necklaces'],
        size: ['L'],
        color: ['gold'],
        price: 800
      });

      await product1.save();
      await product2.save();

      const response = await request(app)
        .get('/api/products?category=rings')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Diamond Ring');
    });
  });

  describe('GET /api/products/find/:id', () => {
    it('should get product by id', async () => {
      const product = new Product({
        title: 'Diamond Ring',
        desc: 'Beautiful diamond ring',
        img: 'ring.jpg',
        categories: ['rings'],
        size: ['M'],
        color: ['gold'],
        price: 1000
      });

      const savedProduct = await product.save();

      const response = await request(app)
        .get(`/api/products/find/${savedProduct._id}`)
        .expect(200);

      expect(response.body.title).toBe('Diamond Ring');
      expect(response.body.price).toBe(1000);
    });

    it('should return 500 for invalid product id', async () => {
      await request(app)
        .get('/api/products/find/invalid-id')
        .expect(500);
    });
  });
});