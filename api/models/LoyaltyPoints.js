import mongoose from "mongoose";

const LoyaltyPointsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        points: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalEarned: {
            type: Number,
            default: 0,
        },
        totalRedeemed: {
            type: Number,
            default: 0,
        },
        tier: {
            type: String,
            enum: ["bronze", "silver", "gold", "platinum"],
            default: "bronze",
        },
        transactions: [
            {
                type: {
                    type: String,
                    enum: ["earned", "redeemed", "expired", "adjusted"],
                    required: true,
                },
                points: {
                    type: Number,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                orderId: {
                    type: String,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

// Calculate tier based on total earned points
LoyaltyPointsSchema.methods.updateTier = function () {
    if (this.totalEarned >= 10000) {
        this.tier = "platinum";
    } else if (this.totalEarned >= 5000) {
        this.tier = "gold";
    } else if (this.totalEarned >= 2000) {
        this.tier = "silver";
    } else {
        this.tier = "bronze";
    }
};

// Add points transaction
LoyaltyPointsSchema.methods.addTransaction = function (type, points, description, orderId = null) {
    this.transactions.push({
        type,
        points,
        description,
        orderId,
    });

    if (type === "earned") {
        this.points += points;
        this.totalEarned += points;
    } else if (type === "redeemed") {
        this.points -= points;
        this.totalRedeemed += points;
    }

    this.updateTier();
};

const LoyaltyPoints = mongoose.model("LoyaltyPoints", LoyaltyPointsSchema);

export default LoyaltyPoints;
