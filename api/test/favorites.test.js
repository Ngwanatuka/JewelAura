import request from 'supertest';
import express from 'express';
import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';
import favoritesRoute from '../routes/favorites.js';

// Mock the models
jest.mock('../models/Favorite.js');
jest.mock('../models/Product.js');

// Mock the verifyToken middleware
jest.mock('../routes/verifyToken.js', () => ({
    verifyTokenAndAuthorization: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/favorites', favoritesRoute);

describe('Favorites API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/favorites', () => {
        it('should add a product to favorites', async () => {
            const mockProduct = { _id: 'product123', title: 'Gold Ring' };
            const mockFavorite = {
                _id: 'fav123',
                userId: 'user123',
                productId: 'product123',
                createdAt: new Date()
            };

            Product.findById.mockResolvedValue(mockProduct);
            Favorite.findOne.mockResolvedValue(null);
            Favorite.prototype.save = jest.fn().mockResolvedValue(mockFavorite);

            const response = await request(app)
                .post('/api/favorites')
                .send({ userId: 'user123', productId: 'product123' });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('userId', 'user123');
            expect(response.body).toHaveProperty('productId', 'product123');
        });

        it('should return 400 if product already in favorites', async () => {
            const mockProduct = { _id: 'product123', title: 'Gold Ring' };
            const existingFavorite = { userId: 'user123', productId: 'product123' };

            Product.findById.mockResolvedValue(mockProduct);
            Favorite.findOne.mockResolvedValue(existingFavorite);

            const response = await request(app)
                .post('/api/favorites')
                .send({ userId: 'user123', productId: 'product123' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Product already in favorites');
        });

        it('should return 404 if product not found', async () => {
            Product.findById.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/favorites')
                .send({ userId: 'user123', productId: 'product123' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found');
        });

        it('should return 400 if userId or productId missing', async () => {
            const response = await request(app)
                .post('/api/favorites')
                .send({ userId: 'user123' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('userId and productId are required');
        });
    });

    describe('GET /api/favorites/:userId', () => {
        it('should get user favorites with product details', async () => {
            const mockFavorites = [
                { _id: 'fav1', userId: 'user123', productId: 'prod1', createdAt: new Date() },
                { _id: 'fav2', userId: 'user123', productId: 'prod2', createdAt: new Date() }
            ];
            const mockProducts = [
                { _id: 'prod1', title: 'Gold Ring', price: 100 },
                { _id: 'prod2', title: 'Silver Necklace', price: 150 }
            ];

            Favorite.find.mockResolvedValue(mockFavorites);
            Product.find.mockResolvedValue(mockProducts);

            const response = await request(app)
                .get('/api/favorites/user123');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('product');
            expect(response.body[0].product.title).toBe('Gold Ring');
        });

        it('should return empty array if no favorites', async () => {
            Favorite.find.mockResolvedValue([]);
            Product.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/api/favorites/user123');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('DELETE /api/favorites/:userId/:productId', () => {
        it('should remove a product from favorites', async () => {
            const mockFavorite = { userId: 'user123', productId: 'product123' };
            Favorite.findOneAndDelete.mockResolvedValue(mockFavorite);

            const response = await request(app)
                .delete('/api/favorites/user123/product123');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Removed from favorites');
        });

        it('should return 404 if favorite not found', async () => {
            Favorite.findOneAndDelete.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/favorites/user123/product123');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Favorite not found');
        });
    });
});
