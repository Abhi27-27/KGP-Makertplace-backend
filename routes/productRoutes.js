import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products — all products (For Home Page)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /api/products/user/:userId — Get specific user's products (NEW: For Dashboard)
router.get('/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your items' });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST /api/products — create product 
router.post('/', async (req, res) => {
  try {
    const { title, price, category, location, description, image, seller } = req.body;
    const product = await Product.create({ title, price, category, location, description, image, seller });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
});

// DELETE /api/products/:id — Delete a product (NEW: For Dashboard)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting' });
  }
});

export default router;