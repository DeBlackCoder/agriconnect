// Categories API
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - List all categories
export async function GET() {
  try {
    await connectDB();
    
    console.log('📁 Categories API called');
    console.log('Database:', process.env.MONGODB_URI?.split('@')[1]?.split('?')[0]);
    
    let categories = await Category.find().sort({ name: 1 });
    console.log(`Found ${categories.length} categories`);
    
    // If no categories exist, create defaults
    if (categories.length === 0) {
      console.log('No categories found, creating defaults...');
      const defaultCategories = [
        { name: 'Fruits', description: 'Fresh fruits', icon: 'Apple' },
        { name: 'Vegetables', description: 'Fresh vegetables', icon: 'Carrot' },
        { name: 'Grains & Cereals', description: 'Rice, wheat, corn', icon: 'Wheat' },
        { name: 'Dairy & Eggs', description: 'Milk, cheese, eggs', icon: 'Milk' },
        { name: 'Herbs & Spices', description: 'Fresh herbs and spices', icon: 'Leaf' },
        { name: 'Organic Products', description: 'Certified organic', icon: 'Sprout' },
      ];
      
      for (const cat of defaultCategories) {
        await Category.create(cat);
        console.log(`Created: ${cat.name}`);
      }
      
      categories = await Category.find().sort({ name: 1 });
      console.log(`✅ Created ${categories.length} default categories`);
    }
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a category (admin only for now, but simplified for MVP)
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, description, icon } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    const category = await Category.create({
      name,
      description: description || '',
      icon: icon || '📦',
    });
    
    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
