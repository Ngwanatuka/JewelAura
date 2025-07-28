import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create test app with same CORS config
const app = express();
app.use(express.json());
app.use(cors({ 
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.options('*', cors());

// Test route
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

describe('CORS Configuration', () => {
  test('should allow OPTIONS preflight request', async () => {
    const response = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');
    
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('should allow POST request from localhost:3000', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'test@test.com', password: 'test' });
    
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('should reject request from unauthorized origin', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:8080')
      .send({ email: 'test@test.com', password: 'test' });
    
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});