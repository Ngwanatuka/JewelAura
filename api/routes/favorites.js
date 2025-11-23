import { Router } from "express";
import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";
import { verifyTokenAndAuthorization } from "./verifyToken.js";

const router = Router();

// ADD TO FAVORITES
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({ userId, productId });
        if (existingFavorite) {
            return res.status(400).json({ message: "Product already in favorites" });
        }

        const newFavorite = new Favorite({ userId, productId });
        const savedFavorite = await newFavorite.save();
        res.status(201).json(savedFavorite);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET USER FAVORITES
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.params.userId });

        // Get full product details for each favorite
        const productIds = favorites.map(fav => fav.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // Combine favorite data with product data
        const favoritesWithProducts = favorites.map(fav => {
            const product = products.find(p => p._id.toString() === fav.productId);
            return {
                _id: fav._id,
                userId: fav.userId,
                productId: fav.productId,
                product: product,
                createdAt: fav.createdAt
            };
        });

        res.status(200).json(favoritesWithProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// REMOVE FROM FAVORITES
router.delete("/:userId/:productId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const favorite = await Favorite.findOneAndDelete({ userId, productId });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Removed from favorites" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
