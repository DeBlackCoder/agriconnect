// Seed Categories Script
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://hillaryprosperwahua_db_user:8DkSf2K99f8r8d4a@ac-6dtfmhz-shard-00-00.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-01.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-02.0l4wwao.mongodb.net:27017/agriconnect?ssl=true&replicaSet=atlas-eg3nv2-shard-0&authSource=admin";

const categories = [
  {
    name: 'Fruits',
    description: 'Fresh fruits including apples, oranges, berries, and tropical fruits',
    icon: 'Apple',
  },
  {
    name: 'Vegetables',
    description: 'Fresh vegetables including leafy greens, root vegetables, and more',
    icon: 'Carrot',
  },
  {
    name: 'Grains & Cereals',
    description: 'Rice, wheat, corn, oats, and other grain products',
    icon: 'Wheat',
  },
  {
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, butter, yogurt, and fresh eggs',
    icon: 'Milk',
  },
  {
    name: 'Herbs & Spices',
    description: 'Fresh herbs, dried spices, and seasonings',
    icon: 'Leaf',
  },
  {
    name: 'Meat & Poultry',
    description: 'Fresh meat, chicken, and other poultry products',
    icon: 'Beef',
  },
  {
    name: 'Organic Products',
    description: 'Certified organic fruits, vegetables, and other produce',
    icon: 'Sprout',
  },
  {
    name: 'Honey & Preserves',
    description: 'Natural honey, jams, jellies, and preserves',
    icon: 'Droplet',
  },
];

async function seedCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);

    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));

    const existingCount = await Category.countDocuments();
    console.log(`Current categories in DB: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing categories...');
      await Category.deleteMany({});
      console.log('✅ Cleared');
    }

    console.log('\nCreating categories...');
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      createdCategories.push(category);
      console.log(`✅ Created: ${category.icon} ${category.name} (ID: ${category._id})`);
    }

    // Verify categories were saved
    const finalCount = await Category.countDocuments();
    console.log(`\n📊 Final count: ${finalCount} categories in database`);
    
    if (finalCount !== createdCategories.length) {
      console.error('⚠️  Warning: Count mismatch!');
    }

    console.log(`\n🎉 Successfully seeded ${createdCategories.length} categories!`);
    console.log('\nCategories are now available in the product creation form\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedCategories();
