// Orders API
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const createOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

// GET - Get user's orders
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'placed' or 'received'
    const status = searchParams.get('status');
    
    let query: any = {};
    
    if (type === 'received') {
      query.sellerId = session.id;
    } else {
      query.buyerId = session.id;
    }
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('productId', '_id name images unit pricePerUnit')
      .populate('buyerId', '_id fullName phoneNumber')
      .populate('sellerId', '_id fullName phoneNumber')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    
    // Get product details
    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check stock
    if (product.availableStock < validatedData.quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }
    
    // Check minimum order
    if (validatedData.quantity < product.minimumOrder) {
      return NextResponse.json(
        { error: `Minimum order is ${product.minimumOrder} ${product.unit}` },
        { status: 400 }
      );
    }
    
    // Calculate total
    const totalAmount = product.pricePerUnit * validatedData.quantity;
    
    // Create order
    const order = await Order.create({
      buyerId: session.id,
      sellerId: product.farmerId,
      productId: product._id,
      quantity: validatedData.quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      totalAmount,
      deliveryAddress: validatedData.deliveryAddress,
      notes: validatedData.notes,
      status: 'pending',
    });
    
    // Update product stock
    product.availableStock -= validatedData.quantity;
    await product.save();
    
    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('productId', '_id name images unit')
      .populate('buyerId', '_id fullName phoneNumber')
      .populate('sellerId', '_id fullName phoneNumber');
    
    return NextResponse.json({
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
