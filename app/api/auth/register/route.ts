// User Registration API - Using Mongoose
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import FarmerProfile from '@/models/FarmerProfile';
import BuyerProfile from '@/models/BuyerProfile';
import { hashPassword, createToken, setSession } from '@/lib/auth';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().optional(),
  role: z.enum(['FARMER', 'BUYER', 'ADMIN']),
  // Farmer-specific fields
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  farmSize: z.number().optional(),
  // Buyer-specific fields
  businessName: z.string().optional(),
  businessType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: hashedPassword,
      fullName: validatedData.fullName,
      phoneNumber: validatedData.phoneNumber,
      role: validatedData.role,
    });
    
    // Create role-specific profile
    if (validatedData.role === 'FARMER') {
      await FarmerProfile.create({
        userId: user._id,
        farmName: validatedData.farmName || '',
        farmLocation: validatedData.farmLocation || '',
        farmSize: validatedData.farmSize,
      });
    } else if (validatedData.role === 'BUYER') {
      await BuyerProfile.create({
        userId: user._id,
        businessName: validatedData.businessName,
        businessType: validatedData.businessType,
      });
    }
    
    // Create session token
    const sessionUser = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      profileImage: user.profileImage,
    };
    
    const token = await createToken(sessionUser);
    await setSession(token);
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
