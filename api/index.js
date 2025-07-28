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
import stripeRoute from './routes/stripe.js';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();

// CORS Configuration - MUST be first
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3002"],
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
app.use("/api/checkout", stripeRoute);

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