import { Router } from "express";
import Order from "../models/Order.js";
import LoyaltyPoints from "../models/LoyaltyPoints.js";
import { sendEmail } from "../services/emailService.js";
import { POINTS_CONFIG } from "./loyalty.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = Router();

// CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE SHIPPING INFO (Admin)
router.put("/:id/shipping", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { trackingNumber, shippingCarrier, estimatedDelivery } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          trackingNumber,
          shippingCarrier,
          estimatedDelivery,
          deliveryStatus: "shipped",
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json("Order not found");
    }

    // Send shipping notification email
    try {
      await sendEmail(order.userId, "orderShipped", {
        order,
        user: { username: "Customer" },
      });
    } catch (emailError) {
      console.error("Failed to send shipping email:", emailError);
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE DELIVERY STATUS (Admin)
router.put("/:id/status", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { deliveryStatus, deliveryDate, notes } = req.body;

    const updateData = { deliveryStatus };
    if (deliveryDate) updateData.deliveryDate = deliveryDate;
    if (notes) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json("Order not found");
    }

    // Send delivery notification if delivered
    if (deliveryStatus === "delivered") {
      try {
        await sendEmail(order.userId, "orderDelivered", {
          order,
          user: { username: "Customer" },
        });
      } catch (emailError) {
        console.error("Failed to send delivery email:", emailError);
      }
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ORDER TRACKING INFO
router.get("/:id/tracking", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json("Order not found");
    }

    // Check authorization
    if (order.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json("Not authorized");
    }

    res.status(200).json({
      orderId: order._id,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      trackingNumber: order.trackingNumber,
      shippingCarrier: order.shippingCarrier,
      estimatedDelivery: order.estimatedDelivery,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
