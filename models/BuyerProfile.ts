// Buyer Profile Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IBuyerProfile extends Document {
  _id: Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessName?: string;
  businessType?: string;
  deliveryAddress?: string;
  rating: number;
  totalPurchases: number;
  createdAt: Date;
  updatedAt: Date;
}

const BuyerProfileSchema = new Schema<IBuyerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BuyerProfile: Model<IBuyerProfile> =
  mongoose.models.BuyerProfile || mongoose.model<IBuyerProfile>('BuyerProfile', BuyerProfileSchema);

export default BuyerProfile;
