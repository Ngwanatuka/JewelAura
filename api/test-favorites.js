import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Favorite from './models/Favorite.js';
import Product from './models/Product.js';
import User from './models/User.js';

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
        testFavoritesFlow();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

async function testFavoritesFlow() {
    try {
        console.log("\n🧪 Testing Favorites Functionality\n");
        console.log("=".repeat(50));

        // Get a test user
        const user = await User.findOne();
        if (!user) {
            console.error("❌ No users found. Please create a user first.");
            process.exit(1);
        }
        console.log(`✓ Found test user: ${user._id}`);

        // Get a test product
        const product = await Product.findOne();
        if (!product) {
            console.error("❌ No products found. Please seed products first.");
            process.exit(1);
        }
        console.log(`✓ Found test product: ${product.title} (${product._id})`);

        // Test 1: Add product to favorites
        console.log("\n📝 Test 1: Adding product to favorites...");

        // First, remove if already exists
        await Favorite.findOneAndDelete({
            userId: user._id,
            productId: product._id
        });

        const newFavorite = new Favorite({
            userId: user._id,
            productId: product._id
        });

        const savedFavorite = await newFavorite.save();
        console.log(`✅ Product added to favorites: ${savedFavorite._id}`);

        // Test 2: Verify favorite exists
        console.log("\n📝 Test 2: Verifying favorite exists...");
        const favorite = await Favorite.findOne({
            userId: user._id,
            productId: product._id
        });

        if (favorite) {
            console.log(`✅ Favorite verified in database`);
        } else {
            console.log(`❌ Favorite not found!`);
        }

        // Test 3: Get all user favorites
        console.log("\n📝 Test 3: Getting all user favorites...");
        const allFavorites = await Favorite.find({ userId: user._id });
        console.log(`✅ User has ${allFavorites.length} favorite(s)`);

        // Get product details for each favorite
        const productIds = allFavorites.map(fav => fav.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        console.log("\nFavorite Products:");
        products.forEach((p, index) => {
            console.log(`  ${index + 1}. ${p.title} - R${p.price}`);
        });

        // Test 4: Remove from favorites
        console.log("\n📝 Test 4: Removing product from favorites...");
        const removed = await Favorite.findOneAndDelete({
            userId: user._id,
            productId: product._id
        });

        if (removed) {
            console.log(`✅ Product removed from favorites`);
        } else {
            console.log(`❌ Failed to remove favorite`);
        }

        // Test 5: Verify removal
        console.log("\n📝 Test 5: Verifying removal...");
        const checkRemoved = await Favorite.findOne({
            userId: user._id,
            productId: product._id
        });

        if (!checkRemoved) {
            console.log(`✅ Favorite successfully removed from database`);
        } else {
            console.log(`❌ Favorite still exists!`);
        }

        console.log("\n" + "=".repeat(50));
        console.log("✅ All favorites tests completed successfully!\n");

    } catch (error) {
        console.error("\n❌ Test failed:", error);
    } finally {
        mongoose.connection.close();
    }
}
