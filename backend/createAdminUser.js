import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

async function createAdminUser() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = 'admin@deadmenalive.com'; // Change if needed
  const username = 'admin';
  const password = 'admin123'; // Change to a strong password
  const hash = await bcrypt.hash(password, 10);

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.password = hash;
    await user.save();
    console.log('Existing user updated to admin:', email);
  } else {
    user = await User.create({ username, email, password: hash, role: 'admin' });
    console.log('New admin user created:', email);
  }
  mongoose.disconnect();
}

createAdminUser().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
