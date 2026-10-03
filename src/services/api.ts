import { Product, Order, Customer, FilterState } from '../types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../data/mockProducts.ts';

const STORAGE_KEYS = {
  PRODUCTS: 'verciano_products_v1',
  ORDERS: 'verciano_orders_v1',
  CUSTOMERS: 'verciano_customers_v1',
  CART: 'verciano_cart_v1',
  WISHLIST: 'verciano_wishlist_v1',
};

// Initialize localStorage fallback
function initLocalDb() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
}

export const apiService = {
  // Fetch products with optional filtering
  async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.searchQuery) params.append('search', filters.searchQuery);
      if (filters?.sortBy) params.append('sort', filters.sortBy);
      if (filters?.selectedSizes && filters.selectedSizes.length > 0) {
        params.append('size', filters.selectedSizes[0]);
      }
      if (filters?.priceRange) {
        params.append('minPrice', String(filters.priceRange[0]));
        params.append('maxPrice', String(filters.priceRange[1]));
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback to localStorage
    }

    initLocalDb();
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let list: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;

    if (filters?.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters?.selectedSizes && filters.selectedSizes.length > 0) {
      list = list.filter(p => p.sizes.some(s => filters.selectedSizes!.includes(s.size) && s.quantity > 0));
    }
    if (filters?.priceRange) {
      list = list.filter(p => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.materials.some(m => m.toLowerCase().includes(q)));
    }
    if (filters?.sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (filters?.sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (filters?.sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (filters?.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    initLocalDb();
    const list: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProd = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as Product;
    list.unshift(newProd);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    initLocalDb();
    const list: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
      return list[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // fallback
    }

    initLocalDb();
    let list: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    list = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return true;
  },

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    initLocalDb();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || JSON.stringify(INITIAL_ORDERS));
  },

  async createOrder(orderPayload: any): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    initLocalDb();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `VRC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      ...orderPayload,
      paymentStatus: orderPayload.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      fulfillmentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      trackingNumber: `VRC-EXP-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Decrement stock in local storage
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    for (const item of orderPayload.items) {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        const s = p.sizes.find(sz => sz.size === item.size);
        if (s) s.quantity = Math.max(0, s.quantity - item.quantity);
      }
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return newOrder;
  },

  async updateOrderStatus(id: string, fulfillmentStatus: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    initLocalDb();
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const ord = orders.find(o => o.id === id);
    if (ord) {
      ord.fulfillmentStatus = fulfillmentStatus as any;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return ord;
    }
    throw new Error('Order not found');
  },

  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    initLocalDb();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || JSON.stringify(INITIAL_CUSTOMERS));
  },
};
