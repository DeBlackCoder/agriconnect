// Product Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  unit: string;
  pricePerUnit: number;
  availableStock: number;
  minimumOrder: number;
  harvestDate?: Date;
  location: string;
  isOrganic: boolean;
  isActive: boolean;
  views: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    availableStock: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      default: 1,
      min: 0,
    },
    harvestDate: {
      type: Date,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optimized indexes for lightning-fast queries
ProductSchema.index({ isActive: 1, createdAt: -1 });           // Primary list query
ProductSchema.index({ categoryId: 1, isActive: 1, createdAt: -1 }); // Category filter
ProductSchema.index({ pricePerUnit: 1, isActive: 1 });         // Price filter
ProductSchema.index({ isOrganic: 1, isActive: 1 });            // Organic filter
ProductSchema.index({ name: 'text', description: 'text' });    // Text search
ProductSchema.index({ farmerId: 1 });                          // Farmer products

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
