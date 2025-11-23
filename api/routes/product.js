import { Router } from "express";
import Product from "../models/Product.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";

const router = Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCTS WITH SEARCH AND FILTERING

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qSearch = req.query.search;
  const qMinPrice = req.query.minPrice;
  const qMaxPrice = req.query.maxPrice;
  const qSort = req.query.sort; // 'price-asc', 'price-desc', 'newest'

  try {
    let query = {};

    // Category filter
    if (qCategory) {
      query.categories = { $in: [qCategory] };
    }

    // Search filter (search in title and description)
    if (qSearch) {
      query.$or = [
        { title: { $regex: qSearch, $options: 'i' } },
        { desc: { $regex: qSearch, $options: 'i' } }
      ];
    }

    // Price range filter
    if (qMinPrice || qMaxPrice) {
      query.price = {};
      if (qMinPrice) query.price.$gte = Number(qMinPrice);
      if (qMaxPrice) query.price.$lte = Number(qMaxPrice);
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (qSort === 'price-asc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (qSort === 'price-desc') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else if (qSort === 'newest' || qNew) {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    // Limit for "new" query
    if (qNew) {
      productsQuery = productsQuery.limit(5);
    }

    const products = await productsQuery;
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
