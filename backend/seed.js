const mongoose = require('mongoose');
const Admin = require('./models/admin.model');
const Hostel = require('./models/hostel.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gurukul_hostel';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Hostel.deleteMany({});

    // Seed Admin
    const admin = new Admin({
      username: 'admin',
      password: 'password123'
    });
    await admin.save();
    console.log('Admin seeded');

    // Seed Hostels
    const hostels = [
      {
        name: 'Aura Living Boys Hostel',
        location: 'Indore, MP',
        rating: 4.5,
        price: 8000,
        discountedPrice: 7500,
        gender: 'Boys',
        established: 2022,
        description: 'Premium boys hostel with all modern amenities.',
        propertyType: 'hostel',
        totalRemainingBeds: 10,
        capacity: 50,
        occupancy: 40,
        hostelType: 'Luxury',
        popular: true,
        images: ['https://images.unsplash.com/photo-1555854817-5b2247a8075f'],
        features: ['WiFi', 'Laundry', '3 Meals'],
        usps: ['Prime Location', 'CCTV Security']
      },
      {
        name: 'Aura Living Girls Hostel',
        location: 'Indore, MP',
        rating: 4.8,
        price: 9000,
        discountedPrice: 8500,
        gender: 'Girls',
        established: 2023,
        description: 'Safe and comfortable girls hostel.',
        propertyType: 'hostel',
        totalRemainingBeds: 5,
        capacity: 40,
        occupancy: 35,
        hostelType: 'Premium',
        popular: true,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'],
        features: ['WiFi', 'Laundry', 'Security'],
        usps: ['Safe Environment', 'Clean Rooms']
      }
    ];

    await Hostel.insertMany(hostels);
    console.log('Hostels seeded');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
