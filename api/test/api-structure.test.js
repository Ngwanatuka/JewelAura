import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Test the basic API structure without database
const app = express();
app.use(express.json());
app.use(cors());

// Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.post('/test-post', (req, res) => {
  res.json({ received: req.body });
});

describe('API Structure Tests', () => {
  test('should handle GET requests', async () => {
    const response = await request(app)
      .get('/test');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API is working');
  });

  test('should handle POST requests with JSON', async () => {
    const testData = { name: 'test', value: 123 };
    
    const response = await request(app)
      .post('/test-post')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(testData);
  });

  test('should handle CORS headers', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:3000');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });
});