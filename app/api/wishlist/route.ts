// Wishlist API
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';

// GET - Get user's wishlist
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const wishlist = await Wishlist.find({ userId: session.id })
      .populate({
        path: 'productId',
        populate: [
          { path: 'farmerId', select: '_id fullName' },
          { path: 'categoryId', select: '_id name icon' },
        ],
      })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST - Add to wishlist
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: session.id, productId });
    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist', inWishlist: true });
    }
    
    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: session.id,
      productId,
    });
    
    return NextResponse.json({
      message: 'Added to wishlist',
      wishlistItem,
      inWishlist: true,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    await Wishlist.findOneAndDelete({ userId: session.id, productId });
    
    return NextResponse.json({
      message: 'Removed from wishlist',
      inWishlist: false,
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
