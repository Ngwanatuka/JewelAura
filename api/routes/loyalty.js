import { Router } from "express";
import LoyaltyPoints from "../models/LoyaltyPoints.js";
import { sendEmail } from "../services/emailService.js";
import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = Router();

// Points configuration
const POINTS_CONFIG = {
    pointsPerDollar: 10, // 10 points per R1 spent
    redeemRate: 100, // 100 points = R1 discount
    minRedeemPoints: 500, // Minimum 500 points to redeem
};

// GET USER LOYALTY POINTS
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        let loyalty = await LoyaltyPoints.findOne({ userId: req.params.userId });

        // Create loyalty account if doesn't exist
        if (!loyalty) {
            loyalty = new LoyaltyPoints({ userId: req.params.userId });
            await loyalty.save();
        }

        res.status(200).json({
            ...loyalty.toObject(),
            config: POINTS_CONFIG,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADD POINTS (Internal use - called after order completion)
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { userId, points, description, orderId } = req.body;

        let loyalty = await LoyaltyPoints.findOne({ userId });

        if (!loyalty) {
            loyalty = new LoyaltyPoints({ userId });
        }

        loyalty.addTransaction("earned", points, description, orderId);
        await loyalty.save();

        res.status(200).json(loyalty);
    } catch (err) {
        res.status(500).json(err);
    }
});

// REDEEM POINTS
router.post("/redeem", verifyToken, async (req, res) => {
    try {
        const { userId, points, description } = req.body;

        const loyalty = await LoyaltyPoints.findOne({ userId });

        if (!loyalty) {
            return res.status(404).json("Loyalty account not found");
        }

        if (points < POINTS_CONFIG.minRedeemPoints) {
            return res.status(400).json(`Minimum ${POINTS_CONFIG.minRedeemPoints} points required to redeem`);
        }

        if (loyalty.points < points) {
            return res.status(400).json("Insufficient points");
        }

        loyalty.addTransaction("redeemed", points, description || "Points redeemed");
        await loyalty.save();

        // Calculate discount value
        const discountValue = (points / POINTS_CONFIG.redeemRate).toFixed(2);

        res.status(200).json({
            success: true,
            pointsRedeemed: points,
            discountValue: `$${discountValue}`,
            remainingPoints: loyalty.points,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET TRANSACTION HISTORY
router.get("/:userId/history", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const loyalty = await LoyaltyPoints.findOne({ userId: req.params.userId });

        if (!loyalty) {
            return res.status(404).json("Loyalty account not found");
        }

        // Sort transactions by date (newest first)
        const sortedTransactions = loyalty.transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.status(200).json(sortedTransactions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET AVAILABLE REWARDS
router.get("/:userId/rewards", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const loyalty = await LoyaltyPoints.findOne({ userId: req.params.userId });

        if (!loyalty) {
            return res.status(404).json("Loyalty account not found");
        }

        // Define reward tiers
        const rewards = [
            {
                id: 1,
                name: "R50 Off Your Next Purchase",
                points: 500,
                value: 50,
                available: loyalty.points >= 500,
            },
            {
                id: 2,
                name: "R100 Off Your Next Purchase",
                points: 1000,
                value: 100,
                available: loyalty.points >= 1000,
            },
            {
                id: 3,
                name: "R250 Off Your Next Purchase",
                points: 2500,
                value: 250,
                available: loyalty.points >= 2500,
            },
            {
                id: 4,
                name: "R500 Off Your Next Purchase",
                points: 5000,
                value: 500,
                available: loyalty.points >= 5000,
            },
            {
                id: 5,
                name: "Free Shipping (Lifetime)",
                points: 10000,
                value: "Free Shipping",
                available: loyalty.points >= 10000,
            },
        ];

        res.status(200).json({
            currentPoints: loyalty.points,
            tier: loyalty.tier,
            rewards,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADMIN: GET ALL LOYALTY ACCOUNTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const loyaltyAccounts = await LoyaltyPoints.find().sort({ totalEarned: -1 });
        res.status(200).json(loyaltyAccounts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADMIN: ADJUST POINTS (for corrections/bonuses)
router.post("/adjust", verifyTokenAndAdmin, async (req, res) => {
    try {
        const { userId, points, description } = req.body;

        const loyalty = await LoyaltyPoints.findOne({ userId });

        if (!loyalty) {
            return res.status(404).json("Loyalty account not found");
        }

        loyalty.addTransaction("adjusted", points, description || "Admin adjustment");
        await loyalty.save();

        res.status(200).json(loyalty);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET LOYALTY STATISTICS (Admin)
router.get("/stats/overview", verifyTokenAndAdmin, async (req, res) => {
    try {
        const totalAccounts = await LoyaltyPoints.countDocuments();
        const tierCounts = await LoyaltyPoints.aggregate([
            {
                $group: {
                    _id: "$tier",
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalPointsIssued = await LoyaltyPoints.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalEarned" },
                },
            },
        ]);

        res.status(200).json({
            totalAccounts,
            tierCounts,
            totalPointsIssued: totalPointsIssued[0]?.total || 0,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

export { POINTS_CONFIG };
export default router;
