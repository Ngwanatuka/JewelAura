import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        productId: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

// Create compound index to ensure a user can't favorite the same product twice
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);
