import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

describe('Backend Core Functions', () => {
  test('password encryption works', () => {
    const password = 'test123';
    const secret = 'secret';
    const encrypted = CryptoJS.AES.encrypt(password, secret).toString();
    const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
    
    expect(decrypted).toBe(password);
  });

  test('JWT token creation works', () => {
    const payload = { id: '123', isAdmin: false };
    const secret = 'secret';
    const token = jwt.sign(payload, secret);
    const decoded = jwt.verify(token, secret);
    
    expect(decoded.id).toBe('123');
    expect(decoded.isAdmin).toBe(false);
  });

  test('email validation works', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });
});