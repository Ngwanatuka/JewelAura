import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.js';

const mockUsers = [];

jest.mock('../models/User.js', () => {
  const UserMock = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: `user_${mockUsers.length + 1}`,
    isAdmin: false,
    save: jest.fn().mockImplementation(function () {
      const record = {
        _id: this._id,
        username: this.username,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin,
      };
      mockUsers.push(record);
      return Promise.resolve({
        _doc: record,
        ...record,
      });
    }),
  }));

  UserMock.findOne = jest.fn().mockImplementation((query) => {
    const found = mockUsers.find((u) => {
      if (query.$or) {
        return query.$or.some((cond) =>
          (cond.email && u.email === cond.email) ||
          (cond.username && u.username === cond.username)
        );
      }
      if (query.username) return u.username === query.username;
      if (query.email) return u.email === query.email;
      return false;
    });
    if (!found) return Promise.resolve(null);
    return Promise.resolve({
      ...found,
      _doc: found,
      save: jest.fn().mockResolvedValue(found),
    });
  });

  return UserMock;
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

describe('Auth Route Tests', () => {
  beforeEach(() => {
    mockUsers.length = 0;
    process.env.JWT_SEC = 'test_jwt_secret';
    jest.clearAllMocks();
  });

  test('should register a new user with scrypt-hashed password', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.password).toBeUndefined();
    expect(mockUsers[0].password).toMatch(/^scrypt:/);
  });

  test('should reject weak passwords under 6 characters', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      });

    expect(response.status).toBe(400);
  });

  test('should not register user with existing email', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await request(app).post('/api/auth/register').send(userData);
    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists.');
  });

  test('should login with valid credentials and reject wrong password', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: userData.password,
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.accessToken).toBeDefined();
    expect(loginResponse.body.username).toBe(userData.username);
    expect(loginResponse.body.password).toBeUndefined();

    const badLogin = await request(app)
      .post('/api/auth/login')
      .send({
        username: userData.username,
        password: 'wrongpassword',
      });

    expect(badLogin.status).toBe(401);
  });
});
