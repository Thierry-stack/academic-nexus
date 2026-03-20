require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'librarian'], default: 'student' },
  },
  { timestamps: true, collection: 'users' }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI. Add it to .env.local (see .env.example).');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log('Connected to MongoDB');

    const email = 'admin@academic.edu';
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      email,
      name: 'System Administrator',
      password: hashedPassword,
      role: 'librarian',
    });

    console.log('Admin user created successfully:');
    console.log('Email:', email);
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
