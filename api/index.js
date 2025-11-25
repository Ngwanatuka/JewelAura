import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
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

dotenv.config();

// MongoDB Connection with SSL/TLS configuration
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
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Check your MongoDB Atlas connection string in .env");
    console.log("2. Ensure your IP address is whitelisted in MongoDB Atlas");
    console.log("3. Verify your database user credentials");
    console.log("4. Check if MongoDB Atlas cluster is running");
    // Don't exit - allow app to run for other routes
  });

const app = express();

// CORS Configuration - MUST be first
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Multer Configuration
const storage = multer.diskStorage({
  // Callback function to control the folder where the uploaded files will be saved.
  // In this case, all files will be saved in the 'uploads' folder.
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  // Callback function to control the filename of the uploaded files.
  // In this case, each filename will be a combination of the current timestamp
  // and the original filename from the client. This is to avoid filename collisions.
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Serve Static Files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
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
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Upload Route
app.post('/api/upload', upload.single('img'), (req, res) => {
  try {
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});