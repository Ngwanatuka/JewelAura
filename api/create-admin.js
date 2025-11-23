import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import CryptoJS from "crypto-js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connection Successful!");

        const adminUser = {
            username: "admin",
            email: "admin@jewelaura.com",
            password: CryptoJS.AES.encrypt("admin123", process.env.PASS_SEC).toString(),
            isAdmin: true,
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const newUser = new User(adminUser);
        await newUser.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@jewelaura.com");
        console.log("Password: admin123");

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

createAdmin();
