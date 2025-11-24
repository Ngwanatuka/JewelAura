import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        verifiedPurchase: {
            type: Boolean,
            default: true,
        },
        helpful: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
