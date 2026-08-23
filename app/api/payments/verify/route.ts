// Payment Verification API - Using Mongoose
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import OrderTracking from '@/models/OrderTracking';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';

// Mock payment verification
// In production, verify with actual payment gateway
async function verifyPaystackPayment(reference: string) {
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  
  if (!PAYSTACK_SECRET) {
    throw new Error('Payment gateway not configured');
  }
  
  // Mock verification - always successful for demo
  return {
    status: 'success',
    reference,
    amount: 0,
    paid_at: new Date().toISOString(),
  };
  
  /* Production implementation:
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  );
  
  const data = await response.json();
  return data.data;
  */
}

// GET - Verify payment status
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }
    
    // Find payment
    const payment = await Payment.findOne({ transactionRef: reference });
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Get order
    const order = await Order.findById(payment.orderId).select('buyerId farmerId orderNumber');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check authorization
    if (
      session.role !== 'ADMIN' &&
      order.buyerId.toString() !== session.id &&
      order.farmerId.toString() !== session.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to verify this payment' },
        { status: 403 }
      );
    }
    
    // If already completed, return success
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        payment: {
          id: payment._id.toString(),
          status: payment.status,
          amount: payment.amount,
          paidAt: payment.paidAt,
        },
      });
    }
    
    // Verify with payment gateway
    let verificationResult;
    
    try {
      verificationResult = await verifyPaystackPayment(reference);
    } catch (error) {
      console.error('Payment verification error:', error);
      
      await Payment.findByIdAndUpdate(payment._id, { status: 'FAILED' });
      
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 500 }
      );
    }
    
    // Check verification result
    if (verificationResult.status !== 'success') {
      await Payment.findByIdAndUpdate(payment._id, { status: 'FAILED' });
      
      return NextResponse.json(
        { error: 'Payment was not successful' },
        { status: 400 }
      );
    }
    
    // Update payment status
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        status: 'COMPLETED',
        paidAt: new Date(verificationResult.paid_at),
      },
      { new: true }
    );
    
    // Update order status
    await Order.findByIdAndUpdate(payment.orderId, { status: 'CONFIRMED' });
    
    await OrderTracking.create({
      orderId: payment.orderId,
      status: 'CONFIRMED',
      description: 'Payment confirmed',
    });
    
    // Create notifications
    await Notification.create({
      userId: order.buyerId,
      title: 'Payment Successful',
      message: `Your payment of $${payment.amount.toFixed(2)} has been confirmed`,
      type: 'payment',
      link: `/orders/${payment.orderId}`,
    });
    
    await Notification.create({
      userId: order.farmerId,
      title: 'Payment Received',
      message: `Payment of $${payment.amount.toFixed(2)} has been received for order ${order.orderNumber}`,
      type: 'payment',
      link: `/orders/${payment.orderId}`,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: updatedPayment!._id.toString(),
        status: updatedPayment!.status,
        amount: updatedPayment!.amount,
        paidAt: updatedPayment!.paidAt,
      },
    });
    
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
