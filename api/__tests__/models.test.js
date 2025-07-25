import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import Product from '../models/Product.js';

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
  await User.deleteMany({});
  await Product.deleteMany({});
});

describe('User Model', () => {
  it('should create a valid user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.isAdmin).toBe(false);
    expect(savedUser.createdAt).toBeDefined();
  });

  it('should require username, email, and password', async () => {
    const user = new User({});
    
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should enforce unique username and email', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    };

    await new User(userData).save();

    const duplicateUser = new User(userData);
    
    let error;
    try {
      await duplicateUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error
  });
});

describe('Product Model', () => {
  it('should create a valid product', async () => {
    const productData = {
      title: 'Diamond Ring',
      desc: 'Beautiful diamond ring',
      img: 'ring.jpg',
      categories: ['rings'],
      size: ['M'],
      color: ['gold'],
      price: 1000
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.title).toBe(productData.title);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.categories).toEqual(productData.categories);
    expect(savedProduct.createdAt).toBeDefined();
  });

  it('should have default values', async () => {
    const product = new Product({
      title: 'Test Product',
      desc: 'Test description',
      img: 'test.jpg',
      price: 100
    });

    const savedProduct = await product.save();

    expect(savedProduct.categories).toEqual([]);
    expect(savedProduct.size).toEqual([]);
    expect(savedProduct.color).toEqual([]);
    expect(savedProduct.inStock).toBe(true);
  });
});