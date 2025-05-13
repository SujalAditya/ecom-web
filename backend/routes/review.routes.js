import express from 'express';
import { Review } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = new Review({ product, user: req.user.id, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get average rating for a product
router.get('/product/:productId/average-rating', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (!result.length) return res.json({ avgRating: 0, count: 0 });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
