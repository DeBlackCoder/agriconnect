// Test route to check if products exist
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    
    const totalCount = await Product.countDocuments();
    const activeCount = await Product.countDocuments({ isActive: true });
    const allProducts = await Product.find().limit(5).lean();
    const activeProducts = await Product.find({ isActive: true }).limit(5).lean();
    
    return NextResponse.json({
      totalCount,
      activeCount,
      allProducts,
      activeProducts,
      database: process.env.MONGODB_URI?.split('@')[1]?.split('/')[1]?.split('?')[0],
      message: `Total: ${totalCount}, Active: ${activeCount}`,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Database error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
