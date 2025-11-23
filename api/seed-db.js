import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
    {
        title: "Gold Bracelet",
        desc: "Elegant 18k gold bracelet with intricate design.",
        img: "http://localhost:5000/uploads/gold-bracelet.jpg",
        categories: ["bracelets", "gold", "women"],
        size: ["small", "medium"],
        color: ["gold"],
        price: 299,
        inStock: true,
    },
    {
        title: "Purple Pearl Necklace",
        desc: "Stunning purple pearl necklace, perfect for special occasions.",
        img: "http://localhost:5000/uploads/purple-purle.jpg",
        categories: ["necklaces", "pearl", "women"],
        size: ["medium"],
        color: ["purple", "white"],
        price: 159,
        inStock: true,
    },
    {
        title: "Diamond Ring",
        desc: "Exquisite diamond ring set in platinum.",
        img: "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        categories: ["rings", "diamond", "women"],
        size: ["small", "medium", "large"],
        color: ["silver"],
        price: 899,
        inStock: true,
    },
    {
        title: "Silver Earrings",
        desc: "Classic silver hoop earrings.",
        img: "https://images.pexels.com/photos/1454185/pexels-photo-1454185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        categories: ["earrings", "silver", "women"],
        size: ["medium"],
        color: ["silver"],
        price: 49,
        inStock: true,
    },
    {
        title: "Vintage Watch",
        desc: "Restored vintage mechanical watch.",
        img: "https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        categories: ["watches", "vintage", "men"],
        size: ["medium"],
        color: ["brown", "gold"],
        price: 450,
        inStock: true,
    },
    {
        title: "Gemstone Pendant",
        desc: "Beautiful gemstone pendant on a gold chain.",
        img: "https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        categories: ["necklaces", "gemstone", "women"],
        size: ["medium"],
        color: ["gold", "red"],
        price: 129,
        inStock: true,
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connection Successful!");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // Insert new products
        await Product.insertMany(products);
        console.log("Products seeded successfully!");

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedProducts();
