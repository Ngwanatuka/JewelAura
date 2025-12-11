import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import favoritesRouter from '../routes/favorites.js';
import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

// Mock the models
jest.mock('../models/Favorite.js');
jest.mock('../models/Product.js');

// Mock the verifyToken middleware
jest.mock('../routes/verifyToken.js', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: 'test-user-id' };
        next();
    },
    verifyTokenAndAuthorization: (req, res, next) => {
        req.user = { id: 'test-user-id' };
        next();
    }
}));

const app = express();
app.use(express.json());
app.use('/api/favorites', favoritesRouter);

describe('Favorites API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/favorites', () => {
        it('should add a product to favorites', async () => {
            const mockProduct = {
                _id: 'product123',
                title: 'Gold Bracelet',
                price: 299,
                img: 'http://example.com/image.jpg'
            };

            const mockFavorite = {
                _id: 'favorite123',
                userId: 'test-user-id',
                productId: 'product123',
                save: jest.fn().mockResolvedValue(true)
            };

            Product.findById = jest.fn().mockResolvedValue(mockProduct);
            Favorite.findOne = jest.fn().mockResolvedValue(null);
            Favorite.mockImplementation(() => mockFavorite);

            const response = await request(app)
                .post('/api/favorites')
                .send({
                    userId: 'test-user-id',
                    productId: 'product123'
                });

            expect(response.status).toBe(200);
            expect(Product.findById).toHaveBeenCalledWith('product123');
            expect(Favorite.findOne).toHaveBeenCalledWith({
                userId: 'test-user-id',
                productId: 'product123'
            });
            expect(mockFavorite.save).toHaveBeenCalled();
        });

        it('should return 400 if product already in favorites', async () => {
            const existingFavorite = {
                userId: 'test-user-id',
                productId: 'product123'
            };

            Favorite.findOne = jest.fn().mockResolvedValue(existingFavorite);

            const response = await request(app)
                .post('/api/favorites')
                .send({
                    userId: 'test-user-id',
                    productId: 'product123'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Product already in favorites');
        });

        it('should return 404 if product not found', async () => {
            Product.findById = jest.fn().mockResolvedValue(null);
            Favorite.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post('/api/favorites')
                .send({
                    userId: 'test-user-id',
                    productId: 'nonexistent'
                });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Product not found');
        });
    });

    describe('GET /api/favorites/:userId', () => {
        it('should get user favorites with product details', async () => {
            const mockFavorites = [
                {
                    _id: 'fav1',
                    userId: 'test-user-id',
                    productId: 'product1'
                }
            ];

            const mockProducts = [
                {
                    _id: 'product1',
                    title: 'Gold Bracelet',
                    price: 299
                }
            ];

            Favorite.find = jest.fn().mockResolvedValue(mockFavorites);
            Product.find = jest.fn().mockResolvedValue(mockProducts);

            const response = await request(app)
                .get('/api/favorites/test-user-id');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(Favorite.find).toHaveBeenCalledWith({ userId: 'test-user-id' });
        });
    });

    describe('DELETE /api/favorites/:userId/:productId', () => {
        it('should remove a product from favorites', async () => {
            Favorite.findOneAndDelete = jest.fn().mockResolvedValue({
                _id: 'favorite123',
                userId: 'test-user-id',
                productId: 'product123'
            });

            const response = await request(app)
                .delete('/api/favorites/test-user-id/product123');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Favorite removed successfully');
            expect(Favorite.findOneAndDelete).toHaveBeenCalledWith({
                userId: 'test-user-id',
                productId: 'product123'
            });
        });

        it('should return 404 if favorite not found', async () => {
            Favorite.findOneAndDelete = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/favorites/test-user-id/nonexistent');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Favorite not found');
        });
    });
});
