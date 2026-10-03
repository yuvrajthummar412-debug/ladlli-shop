-- ====================================================================
-- VERCIANO LUXURY READY-TO-WEAR APPAREL E-COMMERCE
-- Production PostgreSQL Relational Database Schema (DDL)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES TABLE
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'inventory_manager', 'concierge');
CREATE TYPE vip_tier AS ENUM ('standard', 'atelier_member', 'vip_gold', 'vip_platinum');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role user_role DEFAULT 'customer' NOT NULL,
    vip_tier vip_tier DEFAULT 'standard' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hero_image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. PRODUCTS TABLE (Ready-made menswear garments)
CREATE TYPE garment_category AS ENUM ('outerwear', 'knitwear', 'shirts', 'trousers', 'essentials');

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    slug VARCHAR(220) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category garment_category NOT NULL,
    description TEXT NOT NULL,
    price_inr NUMERIC(12, 2) NOT NULL CHECK (price_inr >= 0),
    compare_at_price_inr NUMERIC(12, 2) CHECK (compare_at_price_inr >= price_inr),
    cost_price_inr NUMERIC(12, 2),
    materials TEXT[] NOT NULL DEFAULT '{}',
    care_instructions TEXT[] NOT NULL DEFAULT '{}',
    fit_type VARCHAR(60) DEFAULT 'Regular Luxury',
    images TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_new BOOLEAN DEFAULT TRUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    total_stock INT DEFAULT 0 NOT NULL CHECK (total_stock >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price_inr);

-- 4. PRODUCT VARIANTS & READY-MADE INVENTORY (Strictly no tailoring; ready-made S/M/L/XL/XXL)
CREATE TYPE clothing_size AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_variant VARCHAR(80) UNIQUE NOT NULL,
    size clothing_size NOT NULL,
    color_name VARCHAR(60) NOT NULL,
    color_hex VARCHAR(10) NOT NULL,
    stock_quantity INT DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 3 NOT NULL,
    weight_grams INT DEFAULT 450,
    -- Exact ready-made garment dimensions in cm
    chest_cm NUMERIC(5, 1),
    shoulder_cm NUMERIC(5, 1),
    length_cm NUMERIC(5, 1),
    sleeve_cm NUMERIC(5, 1),
    waist_cm NUMERIC(5, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_product_size_color UNIQUE (product_id, size, color_name)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_size ON product_variants(size);

-- 5. ADDRESSES TABLE
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India' NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. ORDERS TABLE
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE fulfillment_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe', 'cod', 'upi_instant');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(60) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    guest_name VARCHAR(150),
    guest_phone VARCHAR(30),
    subtotal_inr NUMERIC(12, 2) NOT NULL CHECK (subtotal_inr >= 0),
    discount_inr NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    shipping_fee_inr NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    tax_inr NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL CHECK (total_amount_inr >= 0),
    promo_code VARCHAR(40),
    payment_method payment_gateway NOT NULL,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    gateway_transaction_id VARCHAR(150),
    fulfillment_status fulfillment_status DEFAULT 'pending' NOT NULL,
    shipping_address_json JSONB NOT NULL,
    courier_partner VARCHAR(80),
    tracking_number VARCHAR(120),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 7. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    sku VARCHAR(80) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    size clothing_size NOT NULL,
    color_name VARCHAR(60) NOT NULL,
    unit_price_inr NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_inr NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 8. INVENTORY AUDIT LOG TABLE
CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_restock', 'admin_adjustment'
    quantity_changed INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reference_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    adjusted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
