import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
}, { timestamps: true });

CategorySchema.index({ name: 1 }); // Index for fast lookup by name

export default mongoose.model('Category', CategorySchema);
