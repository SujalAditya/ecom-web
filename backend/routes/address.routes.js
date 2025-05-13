import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all addresses for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log('GET /api/addresses for user:', req.user.id, 'addresses:', user.addresses);
    res.json(user.addresses || []);
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Add a new address
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Use $push to update only addresses array to avoid validation error
    await User.updateOne(
      { _id: req.user.id },
      { $push: { addresses: {
        name: req.body.name || '',
        street: req.body.street || '',
        city: req.body.city || '',
        state: req.body.state || '',
        zip: req.body.zip || '',
        country: req.body.country || '',
        phone: req.body.phone || '',
        isDefault: !!req.body.isDefault
      }}}
    );
    const updatedUser = await User.findById(req.user.id);
    res.json(updatedUser.addresses);
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ message: err.message || 'Server error', error: err });
  }
});

// Update an address
router.put('/:idx', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses[req.params.idx] = req.body;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an address
router.delete('/:idx', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.splice(req.params.idx, 1);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
