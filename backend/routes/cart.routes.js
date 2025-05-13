import express from 'express';
// import { User, Product } from '../models/index.js';
// import authMiddleware from '../middleware/auth.js';

// This file is now deprecated. Please use /api/cart2 for all cart operations.

const router = express.Router();

router.all('*', (req, res) => {
  res.status(410).json({ message: 'Deprecated: Use /api/cart2 for all cart operations.' });
});

export default router;
