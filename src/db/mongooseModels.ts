/**
 * MongoDB Mongoose Schema Architecture
 * Alternative NoSQL document data models for Verciano Luxury E-Commerce.
 */

/*
Example Mongoose Model Scaffolding:

import mongoose, { Schema, Document } from 'mongoose';

// 1. User Schema
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin' | 'inventory_manager';
  vipTier: 'standard' | 'atelier_member' | 'vip_gold' | 'vip_platinum';
  isActive: boolean;
  addresses: Array<{
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'inventory_manager'], default: 'customer' },
  vipTier: { type: String, enum: ['standard', 'atelier_member', 'vip_gold', 'vip_platinum'], default: 'standard' },
  isActive: { type: Boolean, default: true },
  addresses: [{
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// 2. Product Schema (Ready-made menswear)
export interface IProduct extends Document {
  sku: string;
  name: string;
  subtitle?: string;
  slug: string;
  category: 'outerwear' | 'knitwear' | 'shirts' | 'trousers' | 'essentials';
  description: string;
  priceInr: number;
  compareAtPriceInr?: number;
  materials: string[];
  careInstructions: string[];
  fitType: string;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  sizes: Array<{
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    stock: number;
    chestCm?: number;
    shoulderCm?: number;
    lengthCm?: number;
    sleeveCm?: number;
    waistCm?: number;
  }>;
  colors: Array<{
    name: string;
    hex: string;
  }>;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  subtitle: { type: String },
  slug: { type: String, required: true, unique: true, index: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['outerwear', 'knitwear', 'shirts', 'trousers', 'essentials'],
    index: true 
  },
  description: { type: String, required: true },
  priceInr: { type: Number, required: true, min: 0 },
  compareAtPriceInr: { type: Number },
  materials: [{ type: String }],
  careInstructions: [{ type: String }],
  fitType: { type: String, default: 'Regular Luxury' },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false, index: true },
  isNew: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  sizes: [{
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
    stock: { type: Number, default: 0, min: 0 },
    chestCm: Number,
    shoulderCm: Number,
    lengthCm: Number,
    sleeveCm: Number,
    waistCm: Number
  }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

// 3. Order Schema
export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: mongoose.Types.ObjectId;
    sku: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPriceInr: number;
    totalPriceInr: number;
    image?: string;
  }>;
  subtotalInr: number;
  discountInr: number;
  shippingFeeInr: number;
  totalAmountInr: number;
  promoCode?: string;
  paymentMethod: 'razorpay' | 'stripe' | 'cod' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  gatewayTransactionId?: string;
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
*/

export const MONGOOSE_SCHEMA_CODE = `
// MongoDB Mongoose Schemas for Verciano Luxury Menswear
import mongoose, { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  vipTier: { type: String, enum: ['standard', 'atelier_member', 'vip_gold', 'vip_platinum'], default: 'standard' },
  addresses: [{
    fullName: String, phone: String, addressLine1: String, addressLine2: String,
    city: String, state: String, postalCode: String, country: { type: String, default: 'India' }
  }]
}, { timestamps: true });

export const ProductSchema = new Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, enum: ['outerwear', 'knitwear', 'shirts', 'trousers', 'essentials'], index: true },
  description: { type: String, required: true },
  priceInr: { type: Number, required: true, min: 0 },
  compareAtPriceInr: Number,
  materials: [String],
  careInstructions: [String],
  fitType: { type: String, default: 'Regular Luxury' },
  sizes: [{
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
    stock: { type: Number, default: 0, min: 0 },
    chestCm: Number, shoulderCm: Number, lengthCm: Number, waistCm: Number
  }],
  colors: [{ name: String, hex: String }],
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 }
}, { timestamps: true });

export const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    sku: String, name: String, size: String, color: String,
    quantity: Number, unitPriceInr: Number, totalPriceInr: Number
  }],
  subtotalInr: Number,
  discountInr: { type: Number, default: 0 },
  shippingFeeInr: { type: Number, default: 0 },
  totalAmountInr: Number,
  paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'cod', 'upi'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  fulfillmentStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  shippingAddress: Object,
  trackingNumber: String
}, { timestamps: true });
`;
