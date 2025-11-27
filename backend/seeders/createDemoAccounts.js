const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const createDemoAccounts = async () => {
  try {
    await connectDB();

    console.log('\n========================================');
    console.log('  Creating Demo Accounts');
    console.log('========================================\n');

    // Clear existing demo users (optional)
    const demoEmails = ['admin@healthcare.com', 'doctor@healthcare.com', 'user@healthcare.com'];

    console.log('Checking for existing demo accounts...');
    await User.deleteMany({ email: { $in: demoEmails } });

    // Find and delete associated doctor profiles
    const existingUsers = await User.find({ email: { $in: demoEmails } });
    for (const user of existingUsers) {
      await Doctor.deleteOne({ userId: user._id });
    }

    console.log('✓ Cleaned up existing demo accounts\n');

    // Create Admin User
    console.log('[1/3] Creating Admin account...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@healthcare.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      age: 35,
      gender: 'male',
    });
    console.log('✓ Admin created');
    console.log(`   Email: admin@healthcare.com`);
    console.log(`   Password: admin123\n`);

    // Create Doctor User
    console.log('[2/3] Creating Doctor account...');
    const doctorUser = await User.create({
      name: 'Dr. Sarah Smith',
      email: 'doctor@healthcare.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+0987654321',
      age: 38,
      gender: 'female',
    });
    console.log('✓ Doctor user created');
    console.log(`   Email: doctor@healthcare.com`);
    console.log(`   Password: doctor123\n`);

    // Create Doctor Profile
    console.log('   Creating doctor profile...');
    const doctorProfile = await Doctor.create({
      userId: doctorUser._id,
      specialization: 'Cardiologist',
      qualification: 'MBBS, MD (Cardiology)',
      experience: 12,
      consultationFee: 500,
      availableSlots: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
        },
        {
          day: 'Wednesday',
          startTime: '09:00',
          endTime: '17:00',
        },
        {
          day: 'Friday',
          startTime: '09:00',
          endTime: '17:00',
        },
      ],
      isAvailable: true,
      hospital: 'City General Hospital',
      address: '123 Medical Center Drive, City',
      rating: 4.8,
      reviewsCount: 156,
    });
    console.log('✓ Doctor profile created\n');

    // Create Regular User (Patient)
    console.log('[3/3] Creating Patient account...');
    const patient = await User.create({
      name: 'John Patient',
      email: 'user@healthcare.com',
      password: 'user123',
      role: 'user',
      phone: '+1122334455',
      age: 30,
      gender: 'male',
      bloodGroup: 'O+',
    });
    console.log('✓ Patient created');
    console.log(`   Email: user@healthcare.com`);
    console.log(`   Password: user123\n`);

    console.log('========================================');
    console.log('  Demo Accounts Created Successfully!');
    console.log('========================================\n');

    console.log('Login Credentials:\n');
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│  ADMIN                                      │');
    console.log('│  Email:    admin@healthcare.com             │');
    console.log('│  Password: admin123                         │');
    console.log('│  Access:   Full system management           │');
    console.log('├─────────────────────────────────────────────┤');
    console.log('│  DOCTOR                                     │');
    console.log('│  Email:    doctor@healthcare.com            │');
    console.log('│  Password: doctor123                        │');
    console.log('│  Access:   Manage patients & appointments   │');
    console.log('├─────────────────────────────────────────────┤');
    console.log('│  PATIENT                                    │');
    console.log('│  Email:    user@healthcare.com              │');
    console.log('│  Password: user123                          │');
    console.log('│  Access:   Health records & appointments    │');
    console.log('└─────────────────────────────────────────────┘\n');

    console.log('You can now login at: http://localhost:3000\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating demo accounts:', error.message);
    process.exit(1);
  }
};

createDemoAccounts();
