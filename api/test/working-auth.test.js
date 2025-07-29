import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.js';
import User from '../models/User.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

describe('Working Auth Tests', () => {
  beforeAll(async () => {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Connect to test database
    const mongoUrl = process.env.NODE_ENV === 'test' 
      ? 'mongodb://localhost:27017/jewelaura_test'
      : process.env.MONGO_URL || 'mongodb://localhost:27017/jewelaura_test';
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000
    });
  }, 60000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000);

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
  });

  test('should register a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.password).toBeUndefined();
  });

  test('should not register user with existing email', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // First registration
    await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    // Second registration with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists.');
  });

  test('should login with valid credentials', async () => {
    // First register a user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Then login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.accessToken).toBeDefined();
    expect(loginResponse.body.username).toBe(userData.username);
  });
});