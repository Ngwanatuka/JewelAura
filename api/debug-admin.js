import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import CryptoJS from "crypto-js";

dotenv.config();

const debugAdmin = async () => {
    try {
        console.log("Connecting to DB...");
        console.log("MONGO_URL:", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connection Successful!");

        const email = "admin@jewelaura.com";
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("User not found:", email);
        } else {
            console.log("User found:", user.username);
            console.log("Is Admin:", user.isAdmin);

            // Try to decrypt password
            try {
                const hashedPassword = CryptoJS.AES.decrypt(
                    user.password,
                    process.env.PASS_SEC
                );
                const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
                console.log("Decrypted Password:", originalPassword);

                if (originalPassword === "admin123") {
                    console.log("Password matches 'admin123'");
                } else {
                    console.log("Password DOES NOT match 'admin123'");
                }
            } catch (e) {
                console.log("Error decrypting password:", e.message);
            }
        }

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

debugAdmin();
