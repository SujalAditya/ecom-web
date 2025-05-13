import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  mobile: { type: String },
  addresses: [
    {
      name: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
      phone: { type: String },
      isDefault: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
