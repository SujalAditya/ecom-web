import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ product: 1 }); // Index for fast lookup by product
ReviewSchema.index({ user: 1 });    // Index for fast lookup by user

export default mongoose.model('Review', ReviewSchema);
