const http = require('http');

console.log('🧪 Testing registration endpoint...');

const testData = JSON.stringify({
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData),
    'Origin': 'http://localhost:3000'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.log('❌ Request failed:', error.message);
});

req.write(testData);
req.end();