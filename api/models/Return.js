import mongoose from "mongoose";

const ReturnSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                reason: {
                    type: String,
                    required: true,
                },
            },
        ],
        returnReason: {
            type: String,
            required: true,
            enum: [
                "defective",
                "wrong_item",
                "not_as_described",
                "changed_mind",
                "size_issue",
                "other",
            ],
        },
        description: {
            type: String,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ["requested", "approved", "rejected", "received", "refunded"],
            default: "requested",
        },
        refundAmount: {
            type: Number,
        },
        refundMethod: {
            type: String,
            enum: ["original_payment", "store_credit"],
            default: "original_payment",
        },
        adminNotes: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

// Index for efficient queries
ReturnSchema.index({ userId: 1, createdAt: -1 });
ReturnSchema.index({ orderId: 1 });
ReturnSchema.index({ status: 1 });

const Return = mongoose.model("Return", ReturnSchema);

export default Return;
