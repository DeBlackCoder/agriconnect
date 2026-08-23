// Order Detail API - Update status
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

// GET - Get single order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    const order = await Order.findById(id)
      .populate('productId', '_id name images unit pricePerUnit location')
      .populate('buyerId', '_id fullName phoneNumber email')
      .populate('sellerId', '_id fullName phoneNumber email');
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Check authorization
    if (order.buyerId._id.toString() !== session.id && order.sellerId._id.toString() !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { status } = await request.json();
    
    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const { id } = await params;
    
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Only seller can update order status (or buyer can cancel)
    const isSeller = order.sellerId.toString() === session.id;
    const isBuyer = order.buyerId.toString() === session.id;
    
    if (!isSeller && !isBuyer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Buyers can only cancel their own orders
    if (isBuyer && !isSeller && status !== 'cancelled') {
      return NextResponse.json({ error: 'Buyers can only cancel orders' }, { status: 403 });
    }
    
    order.status = status;
    await order.save();
    
    const updatedOrder = await Order.findById(order._id)
      .populate('productId', '_id name images unit')
      .populate('buyerId', '_id fullName phoneNumber')
      .populate('sellerId', '_id fullName phoneNumber');
    
    return NextResponse.json({
      message: 'Order status updated',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
