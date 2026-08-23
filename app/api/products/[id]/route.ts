import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Import all models to ensure they're registered
import Product from '@/models/Product';
import User from '@/models/User';
import Category from '@/models/Category';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    const { id } = await context.params;
    
    console.log('[API] Product ID requested:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('[API] Invalid product ID format:', id);
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const queryStart = Date.now();
    console.log('[API] Database connected');
    
    // Use aggregation instead of populate to avoid schema issues
    const products = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'farmerId',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$farmer', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          images: 1,
          pricePerUnit: 1,
          unit: 1,
          availableStock: 1,
          minimumOrder: 1,
          location: 1,
          isOrganic: 1,
          harvestDate: 1,
          views: 1,
          'farmerId._id': '$farmer._id',
          'farmerId.fullName': '$farmer.fullName',
          'farmerId.phoneNumber': '$farmer.phoneNumber',
          'categoryId._id': '$category._id',
          'categoryId.name': '$category.name',
          'categoryId.icon': '$category.icon',
        }
      }
    ]);
    
    if (!products || products.length === 0) {
      console.error('[API] Product not found:', id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];
    console.log('[API] Product found:', product.name);
    console.log(`[API] ⚡ Query time: ${Date.now() - queryStart}ms, Total: ${Date.now() - startTime}ms`);

    // Increment view count (fire and forget)
    Product.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(() => {});

    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      images: product.images,
      pricePerUnit: product.pricePerUnit,
      unit: product.unit,
      availableStock: product.availableStock,
      minimumOrder: product.minimumOrder,
      location: product.location,
      isOrganic: product.isOrganic,
      harvestDate: product.harvestDate,
      views: product.views,
      averageRating: 0,
      reviewCount: 0,
      farmerId: product.farmerId,
      categoryId: product.categoryId,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });
    
  } catch (error) {
    console.error('[API] Error fetching product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
