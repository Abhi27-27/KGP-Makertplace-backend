import express from 'express';
import {
  getAllProducts,
  getUserProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/user/:userId', protect, getUserProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
