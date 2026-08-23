import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';
import Review from '@/models/Review';
import PriceHistory from '@/models/PriceHistory';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

// Create product schema
const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description should be detailed'),
  categoryId: z.string(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  unit: z.string(),
  pricePerUnit: z.number().positive('Price must be positive'),
  availableStock: z.number().positive('Stock must be positive'),
  minimumOrder: z.number().positive('Minimum order must be positive').default(1),
  harvestDate: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  isOrganic: z.boolean().default(false),
});

// GET - List all products with filters and cursor pagination
export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const cursor = searchParams.get('cursor'); // Last product ID for cursor pagination
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1'); // Support both pagination types
    
    // Filter params
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isOrganic = searchParams.get('organic');
    const sortBy = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    console.log('🔍 Fetching products from database');
    const conn = await connectDB();
    
    const queryStart = Date.now();
    
    // Build filter conditions
    const where: any = {
      isActive: true,
    };
    
    // Cursor-based pagination
    if (cursor) {
      where._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }
    
    if (category) {
      where.categoryId = new mongoose.Types.ObjectId(category);
    }
    
    if (search) {
      where.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) where.pricePerUnit.$gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerUnit.$lte = parseFloat(maxPrice);
    }
    
    if (isOrganic === 'true') {
      where.isOrganic = true;
    }
    
    // For cursor pagination, fetch one extra to determine if there's a next page
    const fetchLimit = cursor ? limit + 1 : limit;
    const skip = cursor ? 0 : (page - 1) * limit;
    
    // Ultra-fast direct MongoDB query bypassing Mongoose overhead
    const db = conn.connection.db;
    const productsCollection = db.collection('products');
    
    const sortObj: any = {};
    sortObj[sortBy] = order === 'desc' ? -1 : 1;
    
    const products = await productsCollection
      .find(where)
      .project({
        _id: 1,
        name: 1,
        description: 1,
        images: { $slice: ['$images', 1] }, // Only first image
        pricePerUnit: 1,
        unit: 1,
        availableStock: 1,
        minimumOrder: 1,
        location: 1,
        isOrganic: 1,
        views: 1,
        createdAt: 1,
        farmerId: 1,
        categoryId: 1,
      })
      .sort(sortObj)
      .skip(skip)
      .limit(fetchLimit)
      .toArray();
    
    console.log(`⚡ MongoDB query time: ${Date.now() - queryStart}ms`);
    
    // Transform to match expected format
    const transformedProducts = products.map(p => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      images: Array.isArray(p.images) ? [p.images[0]].filter(Boolean) : [],
      pricePerUnit: p.pricePerUnit,
      unit: p.unit,
      availableStock: p.availableStock,
      minimumOrder: p.minimumOrder,
      location: p.location,
      isOrganic: p.isOrganic || false,
      views: p.views || 0,
      createdAt: p.createdAt,
      averageRating: 0,
      reviewCount: 0,
      farmerId: p.farmerId ? { _id: p.farmerId.toString() } : null,
      categoryId: p.categoryId ? { _id: p.categoryId.toString() } : null,
    }));
    
    let hasMore = false;
    let nextCursor = null;
    let returnProducts = transformedProducts;
    
    // Handle cursor pagination response
    if (cursor && transformedProducts.length > limit) {
      hasMore = true;
      returnProducts = transformedProducts.slice(0, limit);
      nextCursor = returnProducts[returnProducts.length - 1]._id.toString();
    } else if (cursor) {
      returnProducts = transformedProducts;
      nextCursor = transformedProducts.length > 0 ? transformedProducts[transformedProducts.length - 1]._id.toString() : null;
    }
    
    console.log(`✅ Retrieved ${returnProducts.length} products`);
    console.log(`⚡ Query time: ${Date.now() - queryStart}ms, Total time: ${Date.now() - startTime}ms`);
    
    // Get total count only if not using cursor pagination (for page-based UIs)
    let responseData: any = {
      products: returnProducts,
    };
    
    if (cursor) {
      // Cursor-based pagination response
      responseData.pagination = {
        limit,
        hasMore,
        nextCursor,
      };
    } else {
      // Page-based pagination response - use estimatedDocumentCount for speed
      let total = 0;
      
      // Only count if on first page or explicitly requested
      if (page === 1 || searchParams.get('includeCount') === 'true') {
        const countStart = Date.now();
        
        // Use faster estimated count if no filters, otherwise accurate count
        if (Object.keys(where).length === 1 && where.isActive === true) {
          total = await productsCollection.estimatedDocumentCount();
        } else {
          total = await productsCollection.countDocuments(where);
        }
        
        console.log(`⚡ Count query time: ${Date.now() - countStart}ms`);
      }
      
      responseData.pagination = {
        total,
        page,
        limit,
        totalPages: total > 0 ? Math.ceil(total / limit) : 0,
      };
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'X-Total-Count': responseData.pagination.total?.toString() || '0',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
    
  } catch (error) {
    console.error('❌ Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create new product (Any authenticated user)
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to create products.' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);
    
    // Create product
    const product = await Product.create({
      ...validatedData,
      farmerId: session.id,
      harvestDate: validatedData.harvestDate ? new Date(validatedData.harvestDate) : undefined,
    });
    
    // Create initial price history
    await PriceHistory.create({
      productId: product._id,
      price: validatedData.pricePerUnit,
      marketAvg: null,
    });
    
    // Populate references (simplified to avoid nested population issues)
    const populatedProduct = await Product.findById(product._id)
      .populate('categoryId', '_id name icon')
      .populate('farmerId', '_id fullName phoneNumber');
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
