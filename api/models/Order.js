import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    trackingNumber: {
      type: String,
    },
    shippingCarrier: {
      type: String,
    },
    estimatedDelivery: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
    deliveryStatus: {
      type: String,
      enum: ["processing", "shipped", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "processing",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
