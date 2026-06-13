import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/chat', chatRoutes);

export default router;
