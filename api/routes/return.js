import { Router } from "express";
import Return from "../models/Return.js";
import Order from "../models/Order.js";
import { sendEmail } from "../services/emailService.js";
import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = Router();

// CREATE RETURN REQUEST
router.post("/", verifyToken, async (req, res) => {
    try {
        const { orderId, products, returnReason, description, images } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user.id,
        });

        if (!order) {
            return res.status(404).json("Order not found");
        }

        // Check if order is eligible for return (within 30 days)
        const orderDate = new Date(order.createdAt);
        const daysSinceOrder = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));

        if (daysSinceOrder > 30) {
            return res.status(400).json("Return period has expired (30 days)");
        }

        // Check if return already exists for this order
        const existingReturn = await Return.findOne({ orderId });
        if (existingReturn) {
            return res.status(400).json("Return request already exists for this order");
        }

        const newReturn = new Return({
            userId: req.user.id,
            orderId,
            products,
            returnReason,
            description,
            images: images || [],
            status: "requested",
        });

        const savedReturn = await newReturn.save();

        // Send email notification
        try {
            await sendEmail(req.user.email, "returnRequested", {
                returnRequest: savedReturn,
                user: req.user,
            });
        } catch (emailError) {
            console.error("Failed to send return email:", emailError);
        }

        res.status(201).json(savedReturn);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER RETURNS
router.get("/user/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const returns = await Return.find({ userId: req.params.userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(returns);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL RETURNS (Admin)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const query = req.query.status ? { status: req.query.status } : {};
        const returns = await Return.find(query).sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET SINGLE RETURN
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const returnRequest = await Return.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json("Return not found");
        }

        // Check authorization
        if (returnRequest.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json("Not authorized");
        }

        res.status(200).json(returnRequest);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE RETURN STATUS (Admin)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const { status, refundAmount, refundMethod, adminNotes } = req.body;

        const returnRequest = await Return.findById(req.params.id);
        if (!returnRequest) {
            return res.status(404).json("Return not found");
        }

        const updatedReturn = await Return.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status,
                    refundAmount,
                    refundMethod,
                    adminNotes,
                },
            },
            { new: true }
        );

        // Send email notification if approved
        if (status === "approved") {
            try {
                // Get user info from order
                const order = await Order.findById(returnRequest.orderId);
                await sendEmail(order.userId, "returnApproved", {
                    returnRequest: updatedReturn,
                    user: { username: "Customer" }, // You'd fetch actual user here
                });
            } catch (emailError) {
                console.error("Failed to send approval email:", emailError);
            }
        }

        res.status(200).json(updatedReturn);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE RETURN (Admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Return.findByIdAndDelete(req.params.id);
        res.status(200).json("Return has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET RETURN STATISTICS (Admin)
router.get("/stats/overview", verifyTokenAndAdmin, async (req, res) => {
    try {
        const totalReturns = await Return.countDocuments();
        const pendingReturns = await Return.countDocuments({ status: "requested" });
        const approvedReturns = await Return.countDocuments({ status: "approved" });
        const rejectedReturns = await Return.countDocuments({ status: "rejected" });

        res.status(200).json({
            total: totalReturns,
            pending: pendingReturns,
            approved: approvedReturns,
            rejected: rejectedReturns,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
