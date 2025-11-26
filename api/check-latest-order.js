import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    retryWrites: true,
};

mongoose.connect(process.env.MONGO_URL, mongoOptions)
    .then(() => {
        console.log("Connected to MongoDB");
        checkLatestOrder();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

async function checkLatestOrder() {
    try {
        const latestOrder = await Order.findOne().sort({ createdAt: -1 });

        if (latestOrder) {
            console.log("\nLatest Order Details:");
            console.log("---------------------");
            console.log(`Order ID: ${latestOrder._id}`);
            console.log(`User ID: ${latestOrder.userId}`);
            console.log(`Amount: R${latestOrder.amount}`);
            console.log(`Status: ${latestOrder.status}`);
            console.log(`Created At: ${latestOrder.createdAt}`);
            console.log(`Products: ${latestOrder.products.length} items`);
            console.log("---------------------\n");
        } else {
            console.log("No orders found.");
        }
    } catch (error) {
        console.error("Error fetching order:", error);
    } finally {
        mongoose.connection.close();
    }
}
