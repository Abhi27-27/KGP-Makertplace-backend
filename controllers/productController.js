import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'sold' } }).sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these items' });
    }
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Error fetching your items' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, price, category, location, description, image } = req.body;
    const product = await Product.create({
      title,
      price,
      category,
      location,
      description,
      image,
      seller: req.user._id,
    });
    res.status(201).json(product);
  } catch {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Item not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    const { title, price, category, location, description, status } = req.body;
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (location !== undefined) product.location = location;
    if (description !== undefined) product.description = description;
    if (status !== undefined) product.status = status;

    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Server error while updating' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Item not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await product.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error while deleting' });
  }
};
