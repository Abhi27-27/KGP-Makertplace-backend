import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products — all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /api/products/:id — single product with seller info
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email'); // pulls name & email from User model

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST /api/products — create product (seller comes from logged-in user)
router.post('/', async (req, res) => {
  try {
    const { title, price, category, location, description, image, seller } = req.body;
    // 'seller' should be the logged-in user's _id sent from the frontend
    const product = await Product.create({ title, price, category, location, description, image, seller });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

export default router;