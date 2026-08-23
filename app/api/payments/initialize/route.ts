// Payment Initialization API - Using Mongoose
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import OrderTracking from '@/models/OrderTracking';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import mongoose from 'mongoose';

const initializePaymentSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'MOBILE_MONEY']),
});

// Mock payment gateway integration
// In production, integrate with Paystack, Flutterwave, Stripe, etc.
async function initializePaystackPayment(
  amount: number,
  email: string,
  reference: string
) {
  // This is a mock implementation
  // Replace with actual Paystack API call
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  
  if (!PAYSTACK_SECRET) {
    throw new Error('Payment gateway not configured');
  }
  
  // Mock response
  return {
    authorization_url: `https://checkout.paystack.com/mock-${reference}`,
    access_code: `mock-access-${reference}`,
    reference,
  };
  
  /* Production implementation:
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack uses kobo
      reference,
      callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
    }),
  });
  
  const data = await response.json();
  return data.data;
  */
}

// POST - Initialize payment for an order
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    
    if (!session || session.role !== 'BUYER') {
      return NextResponse.json(
        { error: 'Unauthorized. Only buyers can make payments.' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = initializePaymentSchema.parse(body);
    
    if (!mongoose.Types.ObjectId.isValid(validatedData.orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    // Get order details
    const order = await Order.findById(validatedData.orderId).select(
      '_id buyerId totalAmount orderNumber'
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check authorization
    if (order.buyerId.toString() !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized to pay for this order' },
        { status: 403 }
      );
    }
    
    // Check if already paid
    const existingPayment = await Payment.findOne({ orderId: order._id });
    
    if (existingPayment?.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }
    
    // Generate transaction reference
    const transactionRef = `TXN-${order.orderNumber}-${Date.now()}`;
    
    // Initialize payment gateway
    let paymentGatewayResponse;
    
    try {
      paymentGatewayResponse = await initializePaystackPayment(
        order.totalAmount,
        session.email,
        transactionRef
      );
    } catch (error) {
      console.error('Payment gateway error:', error);
      return NextResponse.json(
        { error: 'Payment gateway initialization failed' },
        { status: 500 }
      );
    }
    
    // Create or update payment record
    let payment;
    
    if (existingPayment) {
      payment = await Payment.findByIdAndUpdate(
        existingPayment._id,
        {
          amount: order.totalAmount,
          paymentMethod: validatedData.paymentMethod,
          paymentGateway: 'PAYSTACK',
          transactionRef,
          status: 'PENDING',
          metadata: paymentGatewayResponse,
        },
        { new: true }
      );
    } else {
      payment = await Payment.create({
        orderId: order._id,
        amount: order.totalAmount,
        paymentMethod: validatedData.paymentMethod,
        paymentGateway: 'PAYSTACK',
        transactionRef,
        status: 'PENDING',
        metadata: paymentGatewayResponse,
      });
    }
    
    // Update order status
    await Order.findByIdAndUpdate(order._id, { status: 'PENDING' });
    
    await OrderTracking.create({
      orderId: order._id,
      status: 'PENDING',
      description: 'Payment initiated',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      payment: {
        id: payment!._id.toString(),
        amount: payment!.amount,
        transactionRef: payment!.transactionRef,
        authorizationUrl: paymentGatewayResponse.authorization_url,
        accessCode: paymentGatewayResponse.access_code,
      },
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Initialize payment error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
