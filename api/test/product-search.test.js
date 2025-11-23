import request from 'supertest';
import express from 'express';
import Product from '../models/Product.js';
import productRoute from '../routes/product.js';

// Mock the Product model
jest.mock('../models/Product.js');

// Mock the verifyToken middleware
jest.mock('../routes/verifyToken.js', () => ({
    verifyToken: (req, res, next) => next(),
    verifyTokenAndAuthorization: (req, res, next) => next(),
    verifyTokenAndAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/products', productRoute);

describe('Product Search and Filtering', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/products with search', () => {
        it('should search products by title', async () => {
            const mockProducts = [
                { _id: '1', title: 'Gold Ring', price: 100 },
                { _id: '2', title: 'Gold Necklace', price: 200 }
            ];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProducts)
            };

            Product.find.mockReturnValue(mockProducts);

            const response = await request(app)
                .get('/api/products?search=gold');

            expect(response.status).toBe(200);
            expect(Product.find).toHaveBeenCalled();
        });

        it('should filter products by category', async () => {
            const mockProducts = [
                { _id: '1', title: 'Ring', categories: ['rings'], price: 100 }
            ];

            Product.find.mockReturnValue(mockProducts);

            const response = await request(app)
                .get('/api/products?category=rings');

            expect(response.status).toBe(200);
            expect(Product.find).toHaveBeenCalled();
        });

        it('should filter products by price range', async () => {
            const mockProducts = [
                { _id: '1', title: 'Ring', price: 150 }
            ];

            Product.find.mockReturnValue(mockProducts);

            const response = await request(app)
                .get('/api/products?minPrice=100&maxPrice=200');

            expect(response.status).toBe(200);
            expect(Product.find).toHaveBeenCalled();
        });

        it('should sort products by price ascending', async () => {
            const mockProducts = [
                { _id: '1', title: 'Ring', price: 100 },
                { _id: '2', title: 'Necklace', price: 200 }
            ];

            const mockQuery = {
                sort: jest.fn().mockResolvedValue(mockProducts)
            };

            Product.find.mockReturnValue(mockQuery);

            const response = await request(app)
                .get('/api/products?sort=price-asc');

            expect(response.status).toBe(200);
        });

        it('should sort products by price descending', async () => {
            const mockProducts = [
                { _id: '2', title: 'Necklace', price: 200 },
                { _id: '1', title: 'Ring', price: 100 }
            ];

            const mockQuery = {
                sort: jest.fn().mockResolvedValue(mockProducts)
            };

            Product.find.mockReturnValue(mockQuery);

            const response = await request(app)
                .get('/api/products?sort=price-desc');

            expect(response.status).toBe(200);
        });

        it('should get newest products', async () => {
            const mockProducts = [
                { _id: '3', title: 'New Ring', price: 150, createdAt: new Date() }
            ];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockProducts)
            };

            Product.find.mockReturnValue(mockQuery);

            const response = await request(app)
                .get('/api/products?sort=newest');

            expect(response.status).toBe(200);
        });

        it('should combine multiple filters', async () => {
            const mockProducts = [
                { _id: '1', title: 'Gold Ring', categories: ['rings'], price: 150 }
            ];

            Product.find.mockReturnValue(mockProducts);

            const response = await request(app)
                .get('/api/products?search=gold&category=rings&minPrice=100&maxPrice=200');

            expect(response.status).toBe(200);
            expect(Product.find).toHaveBeenCalled();
        });
    });
});
