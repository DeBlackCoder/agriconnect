// User Model - Multi-role authentication
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['FARMER', 'BUYER', 'ADMIN'],
      required: true,
      index: true,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
