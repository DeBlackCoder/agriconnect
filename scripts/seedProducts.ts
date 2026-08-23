// Seed script to add sample products to the marketplace
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://hillaryprosperwahua_db_user:8DkSf2K99f8r8d4a@ac-6dtfmhz-shard-00-00.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-01.0l4wwao.mongodb.net:27017,ac-6dtfmhz-shard-00-02.0l4wwao.mongodb.net:27017/agriconnect?ssl=true&replicaSet=atlas-eg3nv2-shard-0&authSource=admin';

// Sample products data
const products = [
  {
    name: 'Fresh Organic Tomatoes',
    description: 'Vine-ripened organic tomatoes, perfect for salads and cooking. Grown without pesticides in nutrient-rich soil.',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'],
    unit: 'kg',
    pricePerUnit: 3.99,
    availableStock: 150,
    minimumOrder: 2,
    location: 'California, USA',
    isOrganic: true,
  },
  {
    name: 'Sweet Red Apples',
    description: 'Crisp and juicy red apples, freshly picked from our orchard. High in fiber and vitamin C.',
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'],
    unit: 'kg',
    pricePerUnit: 4.50,
    availableStock: 200,
    minimumOrder: 3,
    location: 'Washington, USA',
    isOrganic: false,
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs from happy hens. Rich in protein and omega-3 fatty acids.',
    images: ['https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800'],
    unit: 'dozen',
    pricePerUnit: 6.99,
    availableStock: 80,
    minimumOrder: 1,
    location: 'Texas, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Spinach Leaves',
    description: 'Tender baby spinach leaves, perfect for salads and smoothies. Packed with iron and vitamins.',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800'],
    unit: 'kg',
    pricePerUnit: 5.25,
    availableStock: 60,
    minimumOrder: 1,
    location: 'Oregon, USA',
    isOrganic: true,
  },
  {
    name: 'Golden Sweet Corn',
    description: 'Sweet and tender corn on the cob, perfect for grilling or boiling. Harvested at peak freshness.',
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800'],
    unit: 'dozen',
    pricePerUnit: 8.99,
    availableStock: 100,
    minimumOrder: 2,
    location: 'Iowa, USA',
    isOrganic: false,
  },
  {
    name: 'Fresh Carrots',
    description: 'Crunchy organic carrots, great for snacking or cooking. High in beta-carotene and fiber.',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800'],
    unit: 'kg',
    pricePerUnit: 2.99,
    availableStock: 120,
    minimumOrder: 2,
    location: 'Michigan, USA',
    isOrganic: true,
  },
  {
    name: 'Organic Strawberries',
    description: 'Sweet and juicy strawberries, perfect for desserts or eating fresh. Grown without chemicals.',
    images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800'],
    unit: 'kg',
    pricePerUnit: 7.99,
    availableStock: 75,
    minimumOrder: 1,
    location: 'Florida, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Bell Peppers',
    description: 'Colorful mix of red, yellow, and green bell peppers. Crisp and sweet, perfect for any dish.',
    images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800'],
    unit: 'kg',
    pricePerUnit: 4.75,
    availableStock: 90,
    minimumOrder: 2,
    location: 'Arizona, USA',
    isOrganic: false,
  },
  {
    name: 'Organic Lettuce',
    description: 'Fresh crisp lettuce heads, perfect for salads. Grown in our pesticide-free greenhouse.',
    images: ['https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800'],
    unit: 'piece',
    pricePerUnit: 2.50,
    availableStock: 150,
    minimumOrder: 3,
    location: 'California, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Potatoes',
    description: 'Premium russet potatoes, perfect for baking, mashing, or frying. Locally grown and fresh.',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'],
    unit: 'kg',
    pricePerUnit: 1.99,
    availableStock: 300,
    minimumOrder: 5,
    location: 'Idaho, USA',
    isOrganic: false,
  },
  {
    name: 'Organic Blueberries',
    description: 'Plump and sweet blueberries, rich in antioxidants. Perfect for breakfast or snacking.',
    images: ['https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800'],
    unit: 'kg',
    pricePerUnit: 12.99,
    availableStock: 50,
    minimumOrder: 1,
    location: 'Maine, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Broccoli',
    description: 'Crisp green broccoli crowns, packed with vitamins and minerals. Great for steaming or stir-frying.',
    images: ['https://images.unsplash.com/photo-1584868857279-b7c37dc195cd?w=800'],
    unit: 'kg',
    pricePerUnit: 3.50,
    availableStock: 85,
    minimumOrder: 2,
    location: 'Oregon, USA',
    isOrganic: true,
  },
  {
    name: 'Sweet Onions',
    description: 'Mild and sweet onions, perfect for salads and cooking. Freshly harvested and cured.',
    images: ['https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=800'],
    unit: 'kg',
    pricePerUnit: 2.25,
    availableStock: 200,
    minimumOrder: 3,
    location: 'Georgia, USA',
    isOrganic: false,
  },
  {
    name: 'Fresh Cucumbers',
    description: 'Crisp and refreshing cucumbers, perfect for salads and pickles. Grown in our organic farm.',
    images: ['https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800'],
    unit: 'kg',
    pricePerUnit: 2.99,
    availableStock: 110,
    minimumOrder: 2,
    location: 'North Carolina, USA',
    isOrganic: true,
  },
  {
    name: 'Organic Kale',
    description: 'Nutrient-dense kale leaves, perfect for smoothies and salads. Super food at its best.',
    images: ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=800'],
    unit: 'kg',
    pricePerUnit: 4.99,
    availableStock: 70,
    minimumOrder: 1,
    location: 'Vermont, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Mushrooms',
    description: 'Premium white button mushrooms, freshly picked. Perfect for soups, salads, and sautéing.',
    images: ['https://images.unsplash.com/photo-1601314002592-b8eee8bbfd18?w=800'],
    unit: 'kg',
    pricePerUnit: 8.50,
    availableStock: 45,
    minimumOrder: 1,
    location: 'Pennsylvania, USA',
    isOrganic: false,
  },
  {
    name: 'Organic Zucchini',
    description: 'Fresh green zucchini, versatile and healthy. Great for grilling, baking, or spiralizing.',
    images: ['https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800'],
    unit: 'kg',
    pricePerUnit: 3.75,
    availableStock: 95,
    minimumOrder: 2,
    location: 'California, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Green Beans',
    description: 'Tender green beans, perfect for steaming or sautéing. Crisp and flavorful.',
    images: ['https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800'],
    unit: 'kg',
    pricePerUnit: 4.25,
    availableStock: 80,
    minimumOrder: 2,
    location: 'Kentucky, USA',
    isOrganic: false,
  },
  {
    name: 'Sweet Butternut Squash',
    description: 'Creamy butternut squash, perfect for soups and roasting. Rich in vitamins A and C.',
    images: ['https://images.unsplash.com/photo-1570268780554-1e25b96d5344?w=800'],
    unit: 'piece',
    pricePerUnit: 3.99,
    availableStock: 60,
    minimumOrder: 2,
    location: 'New York, USA',
    isOrganic: true,
  },
  {
    name: 'Fresh Pumpkins',
    description: 'Large orange pumpkins, perfect for carving or cooking. Great for pies and soups.',
    images: ['https://images.unsplash.com/photo-1569976710208-b52636b52c09?w=800'],
    unit: 'piece',
    pricePerUnit: 5.99,
    availableStock: 100,
    minimumOrder: 1,
    location: 'Illinois, USA',
    isOrganic: false,
  },
];

async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get User model
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find all farmer users
    const farmers = await User.find({ role: 'FARMER' }).limit(5);
    
    if (farmers.length === 0) {
      console.log('❌ No farmers found. Please create farmer accounts first.');
      process.exit(1);
    }

    console.log(`Found ${farmers.length} farmers`);

    // Get Product and Category models
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));

    // Create a default category if none exists
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'Fresh Produce',
        description: 'Fresh fruits and vegetables',
        icon: '🌾',
      });
      console.log('✅ Created default category');
    }

    // Delete existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create products with random farmers
    const createdProducts = [];
    for (const productData of products) {
      const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];
      
      const product = await Product.create({
        ...productData,
        farmerId: randomFarmer._id,
        categoryId: category._id,
        isActive: true,
        views: Math.floor(Math.random() * 100),
      });

      createdProducts.push(product);
      console.log(`✅ Created: ${product.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${createdProducts.length} products!`);
    console.log('\nYou can now visit http://localhost:3000/products to see them\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedProducts();
