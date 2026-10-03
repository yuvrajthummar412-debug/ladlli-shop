import React, { useState } from 'react';
import { X, Copy, Check, Database, Server, Layers, Terminal } from 'lucide-react';
import { FULL_STACK_ARCHITECTURE_DOC } from '../db/architectureDoc.ts';
import { MONGOOSE_SCHEMA_CODE } from '../db/mongooseModels.ts';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'drizzle' | 'mongoose' | 'filestructure' | 'api'>('sql');
  const [copied, setCopied] = useState<boolean>(false);

  const sqlCode = `-- PostgreSQL 16 Production DDL Schema for Verciano Luxury E-Commerce
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'inventory_manager');
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role user_role DEFAULT 'customer' NOT NULL,
    vip_tier VARCHAR(50) DEFAULT 'standard' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Products (Ready-Made Menswear Garments)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- outerwear, knitwear, shirts, trousers, essentials
    price_inr NUMERIC(12, 2) NOT NULL CHECK (price_inr >= 0),
    compare_at_price_inr NUMERIC(12, 2),
    materials TEXT[] NOT NULL DEFAULT '{}',
    care_instructions TEXT[] NOT NULL DEFAULT '{}',
    fit_type VARCHAR(60) DEFAULT 'Regular Luxury',
    images TEXT[] NOT NULL DEFAULT '{}',
    total_stock INT DEFAULT 0 NOT NULL CHECK (total_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Product Variants (Ready-Made Sizes: S, M, L, XL, XXL)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_variant VARCHAR(80) UNIQUE NOT NULL,
    size VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'XL', 'XXL'
    color_name VARCHAR(60) NOT NULL,
    color_hex VARCHAR(10) NOT NULL,
    stock_quantity INT DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    chest_cm NUMERIC(5, 1),
    shoulder_cm NUMERIC(5, 1),
    length_cm NUMERIC(5, 1),
    CONSTRAINT uq_product_size_color UNIQUE (product_id, size, color_name)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(60) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    subtotal_inr NUMERIC(12, 2) NOT NULL,
    discount_inr NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    shipping_fee_inr NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    fulfillment_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    shipping_address_json JSONB NOT NULL,
    tracking_number VARCHAR(120),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    sku VARCHAR(80) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    size VARCHAR(10) NOT NULL,
    color_name VARCHAR(60) NOT NULL,
    unit_price_inr NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_inr NUMERIC(12, 2) NOT NULL
);`;

  const drizzleCode = `// Drizzle ORM Schema (src/db/schema.ts)
import { pgTable, uuid, varchar, numeric, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  role: varchar('role', { length: 50 }).default('customer').notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: varchar('sku', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  priceInr: numeric('price_inr', { precision: 12, scale: 2 }).notNull(),
  totalStock: integer('total_stock').default(0).notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  size: varchar('size', { length: 10 }).notNull(),
  colorName: varchar('color_name', { length: 60 }).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 60 }).unique().notNull(),
  userId: uuid('user_id').references(() => users.id),
  totalAmountInr: numeric('total_amount_inr', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  fulfillmentStatus: varchar('fulfillment_status', { length: 50 }).default('pending'),
  shippingAddress: jsonb('shipping_address').notNull(),
});`;

  const getCurrentCode = () => {
    switch (activeCodeTab) {
      case 'sql':
        return sqlCode;
      case 'drizzle':
        return drizzleCode;
      case 'mongoose':
        return MONGOOSE_SCHEMA_CODE;
      case 'filestructure':
        return FULL_STACK_ARCHITECTURE_DOC.fileTree;
      case 'api':
        return JSON.stringify(FULL_STACK_ARCHITECTURE_DOC.apiEndpoints, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0f0e13] border border-[#272632] rounded-sm shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#212028] bg-[#141318] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-[#d4a373]" />
            <div>
              <h3 className="font-serif-display text-lg text-[#f2efe9]">Full-Stack Architecture & Database Specification</h3>
              <p className="text-[11px] text-[#8e877c]">1 Lakh Rs Benchmark · High-Performance Menswear E-Commerce</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8f887c] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stack Highlights */}
        <div className="p-5 bg-[#121116] border-b border-[#201f28] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[#d4a373] uppercase tracking-wider text-[10px] font-semibold">Frontend</span>
            <p className="text-[#ded8cd] font-medium">Next.js 15 / React 19</p>
            <p className="text-[#7e786d] text-[11px]">Tailwind v4, Cinzel Serif, Glassmorphism trust pills.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#d4a373] uppercase tracking-wider text-[10px] font-semibold">Backend</span>
            <p className="text-[#ded8cd] font-medium">Node.js LTS / Express</p>
            <p className="text-[#7e786d] text-[11px]">Drizzle ORM, Zod validation, atomic inventory lock.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#d4a373] uppercase tracking-wider text-[10px] font-semibold">Primary Database</span>
            <p className="text-[#ded8cd] font-medium">PostgreSQL 16 (Relational)</p>
            <p className="text-[#7e786d] text-[11px]">ACID transactions, UUIDs, garment size matrix.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#d4a373] uppercase tracking-wider text-[10px] font-semibold">Payment Gateway</span>
            <p className="text-[#ded8cd] font-medium">Razorpay / Stripe Payments</p>
            <p className="text-[#7e786d] text-[11px]">Cards, UPI QR intent, NetBanking, HMAC webhooks.</p>
          </div>
        </div>

        {/* Schema Sub-Tabs */}
        <div className="px-5 border-b border-[#1f1e26] bg-[#100f13] flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'sql', label: 'PostgreSQL Schema (DDL)' },
              { id: 'drizzle', label: 'Drizzle ORM (TypeScript)' },
              { id: 'mongoose', label: 'MongoDB Mongoose' },
              { id: 'filestructure', label: 'Repo File Structure' },
              { id: 'api', label: 'REST API Contracts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`py-3 px-3 uppercase tracking-wider text-[11px] font-medium transition-colors border-b-2 ${
                  activeCodeTab === tab.id
                    ? 'border-[#d4a373] text-[#f2efe9] font-bold'
                    : 'border-transparent text-[#847d72] hover:text-[#d1c9be]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1d25] hover:bg-[#2a2935] text-[#d4cebe] hover:text-white rounded-xs text-[11px] transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Canvas */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#0a0a0d]">
          <pre className="text-xs font-mono text-[#d6d0c4] leading-relaxed overflow-x-auto selection:bg-[#3d382f]">
            {getCurrentCode()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121116] border-t border-[#201f28] flex items-center justify-between text-xs text-[#847e73]">
          <span>Files available in repository: <code className="text-[#d4a373]">src/db/schema.sql</code> and <code className="text-[#d4a373]">src/db/schema.ts</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#201f28] hover:bg-[#2b2a37] text-[#f2efe9] rounded-sm transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
