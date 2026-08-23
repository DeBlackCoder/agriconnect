// Create sample farmer accounts
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb://hillaryprosperwahua_db_user:8DkSf2K99f8r8d4a@ac-6dtfmhz-shard-00-00.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-01.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-02.0l4wwao.mongodb.net:27017/agriconnect?ssl=true&replicaSet=atlas-eg3nv2-shard-0&authSource=admin";

const farmers = [
  {
    email: 'john.farmer@agriconnect.com',
    fullName: 'John Smith',
    phoneNumber: '+1-555-0101',
    farmName: 'Smith Family Farm',
    farmLocation: 'California, USA',
    farmSize: 150,
  },
  {
    email: 'mary.green@agriconnect.com',
    fullName: 'Mary Green',
    phoneNumber: '+1-555-0102',
    farmName: 'Green Valley Organic',
    farmLocation: 'Oregon, USA',
    farmSize: 85,
  },
  {
    email: 'robert.harvest@agriconnect.com',
    fullName: 'Robert Harvest',
    phoneNumber: '+1-555-0103',
    farmName: 'Harvest Moon Farm',
    farmLocation: 'Texas, USA',
    farmSize: 200,
  },
  {
    email: 'sarah.fields@agriconnect.com',
    fullName: 'Sarah Fields',
    phoneNumber: '+1-555-0104',
    farmName: 'Fields of Gold',
    farmLocation: 'Iowa, USA',
    farmSize: 120,
  },
  {
    email: 'mike.organic@agriconnect.com',
    fullName: 'Mike Johnson',
    phoneNumber: '+1-555-0105',
    farmName: 'Johnson Organic Produce',
    farmLocation: 'Washington, USA',
    farmSize: 95,
  },
];

async function createFarmers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const FarmerProfile = mongoose.model('FarmerProfile', new mongoose.Schema({}, { strict: false }));

    const password = 'farmer123'; // Default password for all farmers
    const hashedPassword = await bcrypt.hash(password, 12);

    for (const farmerData of farmers) {
      // Check if farmer already exists
      const existing = await User.findOne({ email: farmerData.email });
      if (existing) {
        console.log(`⏭️  Skipped: ${farmerData.fullName} (already exists)`);
        continue;
      }

      // Create user
      const user = await User.create({
        email: farmerData.email,
        password: hashedPassword,
        fullName: farmerData.fullName,
        phoneNumber: farmerData.phoneNumber,
        role: 'FARMER',
        isVerified: true,
        isActive: true,
      });

      // Create farmer profile
      await FarmerProfile.create({
        userId: user._id,
        farmName: farmerData.farmName,
        farmLocation: farmerData.farmLocation,
        farmSize: farmerData.farmSize,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        totalSales: Math.floor(Math.random() * 50),
      });

      console.log(`✅ Created: ${farmerData.fullName} - ${farmerData.email}`);
    }

    console.log(`\n🎉 Farmers created successfully!`);
    console.log(`\nDefault password for all farmers: ${password}`);
    console.log('\nNow run: npm run seed\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createFarmers();
