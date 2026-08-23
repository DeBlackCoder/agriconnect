// Farmer Profile Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IFarmerProfile extends Document {
  _id: Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  farmName: string;
  farmLocation: string;
  farmSize?: number; // in acres/hectares
  farmDescription?: string;
  bankAccount?: string;
  bankName?: string;
  rating: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerProfileSchema = new Schema<IFarmerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    farmName: {
      type: String,
      required: true,
      trim: true,
    },
    farmLocation: {
      type: String,
      required: true,
      trim: true,
    },
    farmSize: {
      type: Number,
    },
    farmDescription: {
      type: String,
      trim: true,
    },
    bankAccount: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FarmerProfile: Model<IFarmerProfile> =
  mongoose.models.FarmerProfile || mongoose.model<IFarmerProfile>('FarmerProfile', FarmerProfileSchema);

export default FarmerProfile;
