import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/intech-healthcare';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});

    // Create Admin User
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Intech Admin',
      email: 'intechhealthcare@gmail.com',
      password: 'Intech@Admin',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin user created:', admin.email);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Admin user created: 1`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: intechhealthcare@gmail.com');
    console.log('Password: Intech@Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Keep these credentials secure!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();
