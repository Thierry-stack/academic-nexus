const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/academic-nexus';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@academic.edu' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      email: 'admin@academic.edu',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'librarian',
    });

    await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Email: admin@academic.edu');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();