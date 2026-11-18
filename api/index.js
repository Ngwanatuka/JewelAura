import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import yocoRoute from './routes/yoco.js';
import favoritesRoute from './routes/favorites.js';
import reviewRoutes from './routes/review.js';
import returnRoutes from './routes/return.js';
import loyaltyRoutes from './routes/loyalty.js';
import { verifyTokenAndAdmin } from './routes/verifyToken.js';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// MongoDB Connection Options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  ...(isProduction && process.env.MONGO_SSL === 'true' && {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
  }),
  retryWrites: true,
};

if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL, mongoOptions)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });
} else {
  console.warn("⚠️ MONGO_URL is not set");
}

const app = express();
app.disable('x-powered-by');

// Basic Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiter for auth endpoints
const authAttempts = new Map();
const authRateLimiter = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 30;
  const entry = authAttempts.get(ip);

  if (!entry || now - entry.start > windowMs) {
    authAttempts.set(ip, { count: 1, start: now });
    return next();
  }
  entry.count += 1;
  if (entry.count > maxAttempts) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
  next();
};

// CORS Configuration
const envOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()) : []),
].filter(Boolean);

const devOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003"
];

const allowedOrigins = isProduction ? envOrigins : [...new Set([...devOrigins, ...envOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Multer Configuration with file type and size limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
    }
  },
});

// Serve Static Files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/yoco", yocoRoute);
app.use("/api/favorites", favoritesRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/loyalty", loyaltyRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady || !isProduction ? 200 : 503).json({
    status: dbReady ? 'OK' : 'DEGRADED',
    database: dbReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Protected Admin Upload Route
app.post('/api/upload', verifyTokenAndAdmin, upload.single('img'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }
  const baseUrl = process.env.BACKEND_URL || '';
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  if (err instanceof multer.MulterError || err.message?.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS origin not allowed' });
  }
  res.status(err.status || 500).json({
    message: isProduction ? 'Internal server error' : err.message || 'Internal server error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
