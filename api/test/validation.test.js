import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

describe('Backend Utilities Tests', () => {
  describe('Password Encryption', () => {
    test('should encrypt and decrypt passwords', () => {
      const password = 'testpassword123';
      const secret = 'testsecret';
      
      const encrypted = CryptoJS.AES.encrypt(password, secret).toString();
      const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
      
      expect(encrypted).not.toBe(password);
      expect(decrypted).toBe(password);
    });

    test('should produce different encrypted values for same password', () => {
      const password = 'testpassword123';
      const secret = 'testsecret';
      
      const encrypted1 = CryptoJS.AES.encrypt(password, secret).toString();
      const encrypted2 = CryptoJS.AES.encrypt(password, secret).toString();
      
      // Due to random IV, encrypted values should be different
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to the same password
      const decrypted1 = CryptoJS.AES.decrypt(encrypted1, secret).toString(CryptoJS.enc.Utf8);
      const decrypted2 = CryptoJS.AES.decrypt(encrypted2, secret).toString(CryptoJS.enc.Utf8);
      
      expect(decrypted1).toBe(password);
      expect(decrypted2).toBe(password);
    });
  });

  describe('JWT Token Handling', () => {
    test('should create and verify JWT tokens', () => {
      const payload = { id: 'user123', isAdmin: false };
      const secret = 'testsecret';
      
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.isAdmin).toBe(payload.isAdmin);
    });

    test('should handle admin tokens', () => {
      const adminPayload = { id: 'admin123', isAdmin: true };
      const secret = 'testsecret';
      
      const token = jwt.sign(adminPayload, secret);
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.isAdmin).toBe(true);
    });

    test('should reject invalid tokens', () => {
      const invalidToken = 'invalid.token.here';
      const secret = 'testsecret';
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });
  });

  describe('Data Validation', () => {
    test('should validate email format', () => {
      const validEmails = ['test@example.com', 'user@domain.org', 'admin@site.net'];
      const invalidEmails = ['invalid-email', '@domain.com', 'user@', 'user.domain.com'];
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
      
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    test('should validate required fields', () => {
      const validUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const invalidUsers = [
        { email: 'test@example.com', password: 'password123' }, // missing username
        { username: 'testuser', password: 'password123' }, // missing email
        { username: 'testuser', email: 'test@example.com' } // missing password
      ];
      
      const hasRequiredFields = (user) => {
        return !!(user.username && user.email && user.password);
      };
      
      expect(hasRequiredFields(validUser)).toBe(true);
      
      invalidUsers.forEach(user => {
        expect(hasRequiredFields(user)).toBe(false);
      });
    });
  });
});