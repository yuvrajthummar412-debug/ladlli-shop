/**
 * Drizzle ORM Schema Definitions for PostgreSQL
 * Fully typed relational mapping for production TypeScript backends.
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'inventory_manager', 'concierge']);
export const vipTierEnum = pgEnum('vip_tier', ['standard', 'atelier_member', 'vip_gold', 'vip_platinum']);
export const garmentCategoryEnum = pgEnum('garment_category', ['outerwear', 'knitwear', 'shirts', 'trousers', 'essentials']);
export const clothingSizeEnum = pgEnum('clothing_size', ['S', 'M', 'L', 'XL', 'XXL']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);
export const fulfillmentStatusEnum = pgEnum('fulfillment_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  role: userRoleEnum('role').default('customer').notNull(),
  vipTier: vipTierEnum('vip_tier').default('standard').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Products Table (Ready-made menswear apparel)
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: varchar('sku', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }),
  slug: varchar('slug', { length: 220 }).unique().notNull(),
  category: garmentCategoryEnum('category').notNull(),
  description: text('description').notNull(),
  priceInr: numeric('price_inr', { precision: 12, scale: 2 }).notNull(),
  compareAtPriceInr: numeric('compare_at_price_inr', { precision: 12, scale: 2 }),
  materials: text('materials').array().notNull(),
  careInstructions: text('care_instructions').array().notNull(),
  fitType: varchar('fit_type', { length: 60 }).default('Regular Luxury'),
  images: text('images').array().notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isNew: boolean('is_new').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  totalStock: integer('total_stock').default(0).notNull(),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('5.0'),
  reviewsCount: integer('reviews_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Product Variants (Ready-made sizes: S, M, L, XL, XXL)
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  skuVariant: varchar('sku_variant', { length: 80 }).unique().notNull(),
  size: clothingSizeEnum('size').notNull(),
  colorName: varchar('color_name', { length: 60 }).notNull(),
  colorHex: varchar('color_hex', { length: 10 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(3).notNull(),
  chestCm: numeric('chest_cm', { precision: 5, scale: 1 }),
  shoulderCm: numeric('shoulder_cm', { precision: 5, scale: 1 }),
  lengthCm: numeric('length_cm', { precision: 5, scale: 1 }),
  sleeveCm: numeric('sleeve_cm', { precision: 5, scale: 1 }),
  waistCm: numeric('waist_cm', { precision: 5, scale: 1 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 60 }).unique().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  subtotalInr: numeric('subtotal_inr', { precision: 12, scale: 2 }).notNull(),
  discountInr: numeric('discount_inr', { precision: 12, scale: 2 }).default('0.00').notNull(),
  shippingFeeInr: numeric('shipping_fee_inr', { precision: 12, scale: 2 }).default('0.00').notNull(),
  totalAmountInr: numeric('total_amount_inr', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
  fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status').default('pending').notNull(),
  shippingAddress: jsonb('shipping_address').notNull(),
  trackingNumber: varchar('tracking_number', { length: 120 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Order Items Table
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
  sku: varchar('sku', { length: 80 }).notNull(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  size: clothingSizeEnum('size').notNull(),
  colorName: varchar('color_name', { length: 60 }).notNull(),
  unitPriceInr: numeric('unit_price_inr', { precision: 12, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  totalPriceInr: numeric('total_price_inr', { precision: 12, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, (helpers: any) => ({
  variants: helpers.many(productVariants),
  orderItems: helpers.many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, (helpers: any) => ({
  product: helpers.one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, (helpers: any) => ({
  user: helpers.one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: helpers.many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, (helpers: any) => ({
  order: helpers.one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: helpers.one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
