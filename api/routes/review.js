import { Router } from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = Router();

// CREATE REVIEW (verified purchasers only)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;

        // Verify user purchased the product
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.id,
            status: "completed",
        });

        if (!order) {
            return res.status(403).json("You can only review products you've purchased");
        }

        // Check if product is in the order
        const productInOrder = order.products.some(
            (p) => p.productId === productId
        );

        if (!productInOrder) {
            return res.status(403).json("Product not found in this order");
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            userId: req.user.id,
            productId,
        });

        if (existingReview) {
            return res.status(400).json("You have already reviewed this product");
        }

        const newReview = new Review({
            userId: req.user.id,
            productId,
            orderId,
            rating,
            comment,
            verifiedPurchase: true,
        });

        const savedReview = await Review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET PRODUCT REVIEWS
router.get("/product/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .sort({ createdAt: -1 })
            .limit(50);

        // Calculate average rating
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                : 0;

        res.status(200).json({
            reviews,
            averageRating: avgRating.toFixed(1),
            totalReviews: reviews.length,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER REVIEWS
router.get("/user/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE REVIEW
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json("Review not found");
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json("You can only update your own reviews");
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE REVIEW
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json("Review not found");
        }

        // Allow user to delete their own review or admin to delete any
        if (review.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json("You can only delete your own reviews");
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("Review has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// MARK REVIEW AS HELPFUL
router.put("/:id/helpful", async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpful: 1 } },
            { new: true }
        );
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL REVIEWS (Admin)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
