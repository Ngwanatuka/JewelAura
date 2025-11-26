import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to MongoDB");
        const count = await Product.countDocuments();
        console.log(`Total products in database: ${count}`);

        if (count > 0) {
            const products = await Product.find().limit(3);
            console.log("\nSample products:");
            products.forEach(p => console.log(`- ${p.title} (R${p.price})`));
        }

        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
