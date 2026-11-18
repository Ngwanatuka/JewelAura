import { Router } from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router = Router();

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
};

const verifyPassword = (inputPassword, storedPassword) => {
  if (storedPassword.startsWith("scrypt:")) {
    const [, salt, hash] = storedPassword.split(":");
    const derived = crypto.scryptSync(inputPassword, salt, 64);
    const storedBuf = Buffer.from(hash, "hex");
    return derived.length === storedBuf.length && crypto.timingSafeEqual(derived, storedBuf);
  }
  // Legacy CryptoJS.AES fallback
  if (!process.env.PASS_SEC) return false;
  const decrypted = CryptoJS.AES.decrypt(storedPassword, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
  return decrypted === inputPassword;
};

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required." });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password),
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser._doc;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password: inputPassword } = req.body;

  if (!username || !inputPassword) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    const isValid = verifyPassword(inputPassword, user.password);
    if (!isValid) {
      return res.status(401).json("Invalid credentials");
    }

    // Upgrade legacy CryptoJS passwords to scrypt on successful login
    if (!user.password.startsWith("scrypt:")) {
      user.password = hashPassword(inputPassword);
      await user.save();
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
