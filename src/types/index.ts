export interface ProductSizeStock {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeMeasurement {
  chest: string;
  shoulder: string;
  length: string;
  sleeve?: string;
  waist?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: 'outerwear' | 'knitwear' | 'shirts' | 'trousers' | 'essentials';
  price: number;
  compareAtPrice?: number;
  description: string;
  materials: string[];
  careInstructions: string[];
  fitType: 'Regular Luxury' | 'Relaxed Tailored' | 'Structured Classic';
  sizes: ProductSizeStock[];
  colors: ProductColor[];
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  measurements: Record<'S' | 'M' | 'L' | 'XL' | 'XXL', SizeMeasurement>;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart line id: productId-size-color
  product: Product;
  selectedSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  selectedColor: ProductColor;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'VIP Platinum' | 'VIP Gold' | 'Atelier Member';
  totalSpend: number;
  ordersCount: number;
  lastActive: string;
  joinedDate: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'UPI' | 'Credit Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  fulfillmentStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
  trackingNumber?: string;
}

export interface FilterState {
  category: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
}
