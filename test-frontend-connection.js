const https = require('https');
const http = require('http');

console.log('🔗 Testing frontend to backend connection...');

// Test health endpoint
const healthOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:3000'
  }
};

const healthReq = http.request(healthOptions, (res) => {
  console.log('✅ Health endpoint status:', res.statusCode);
  console.log('✅ CORS headers:', res.headers['access-control-allow-origin']);
});

healthReq.on('error', (error) => {
  console.log('❌ Health endpoint failed:', error.message);
});

healthReq.end();

// Test auth login endpoint
const authOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000'
  }
};

const authReq = http.request(authOptions, (res) => {
  console.log('✅ Auth endpoint status:', res.statusCode);
  console.log('✅ CORS headers:', res.headers['access-control-allow-origin']);
});

authReq.on('error', (error) => {
  console.log('❌ Auth endpoint failed:', error.message);
});

authReq.write(JSON.stringify({ email: 'test@test.com', password: 'test' }));
authReq.end();