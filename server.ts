import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from './src/data/mockProducts.ts';
import { Product, Order, Customer } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database Store initialized from seed data
let productsDb: Product[] = [...INITIAL_PRODUCTS];
let ordersDb: Order[] = [...INITIAL_ORDERS];
let customersDb: Customer[] = [...INITIAL_CUSTOMERS];

// ==========================================
// BACKEND API ROUTES
// ==========================================

// 1. GET /api/products (Filtering, Search, Sizing & Sorting)
app.get('/api/products', (req: Request, res: Response) => {
  const { category, size, minPrice, maxPrice, search, sort } = req.query;

  let filtered = [...productsDb];

  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Ready-made size filter (S, M, L, XL, XXL)
  if (size) {
    const sizeStr = String(size);
    filtered = filtered.filter(p => 
      p.sizes.some(s => s.size === sizeStr && s.quantity > 0)
    );
  }

  // Price range filter
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  // Search keyword filter
  if (search) {
    const query = String(search).toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.subtitle.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.materials.some(m => m.toLowerCase().includes(query))
    );
  }

  // Sorting
  switch (sort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
});

// 2. GET /api/products/:id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = productsDb.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// 3. POST /api/products (Admin CRUD: Create)
app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  productsDb.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// 4. PUT /api/products/:id (Admin CRUD: Update)
app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = productsDb.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  productsDb[index] = { ...productsDb[index], ...req.body };
  res.json({ success: true, data: productsDb[index] });
});

// 5. DELETE /api/products/:id (Admin CRUD: Delete)
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = productsDb.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  const deleted = productsDb.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// 6. GET /api/orders (Admin order management)
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ success: true, total: ordersDb.length, data: ordersDb });
});

// 7. POST /api/orders (Storefront checkout & atomic inventory decrement)
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items, subtotal, discount, shippingFee, totalAmount, shippingAddress, paymentMethod } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Order must contain items' });
  }

  // Decrement ready-made inventory stock
  for (const item of items) {
    const prod = productsDb.find(p => p.id === item.productId);
    if (prod) {
      const sizeObj = prod.sizes.find(s => s.size === item.size);
      if (sizeObj) {
        sizeObj.quantity = Math.max(0, sizeObj.quantity - item.quantity);
      }
    }
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `VRC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    customer,
    items,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
    fulfillmentStatus: 'Pending',
    createdAt: new Date().toISOString(),
    trackingNumber: `VRC-EXP-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
  };

  ordersDb.unshift(newOrder);

  // Update or add customer record
  const existingCust = customersDb.find(c => c.email.toLowerCase() === customer.email.toLowerCase());
  if (existingCust) {
    existingCust.ordersCount += 1;
    existingCust.totalSpend += totalAmount;
    existingCust.lastActive = new Date().toISOString().split('T')[0];
    if (existingCust.totalSpend > 100000) existingCust.tier = 'VIP Platinum';
    else if (existingCust.totalSpend > 50000) existingCust.tier = 'VIP Gold';
  } else {
    customersDb.unshift({
      id: `cust-${Date.now()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      tier: totalAmount > 50000 ? 'VIP Gold' : 'Atelier Member',
      totalSpend: totalAmount,
      ordersCount: 1,
      lastActive: new Date().toISOString().split('T')[0],
      joinedDate: new Date().toISOString().split('T')[0],
    });
  }

  res.status(201).json({ success: true, data: newOrder });
});

// 8. PATCH /api/orders/:id/status (Admin status progression)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { fulfillmentStatus, paymentStatus } = req.body;
  const order = ordersDb.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  res.json({ success: true, data: order });
});

// 9. GET /api/customers
app.get('/api/customers', (_req: Request, res: Response) => {
  res.json({ success: true, total: customersDb.length, data: customersDb });
});

// 10. GET /api/metrics (Executive dashboard metrics)
app.get('/api/metrics', (_req: Request, res: Response) => {
  const totalRevenue = ordersDb
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalOrders = ordersDb.length;
  const activeOrders = ordersDb.filter(o => o.fulfillmentStatus !== 'Delivered').length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  const totalStockUnits = productsDb.reduce(
    (acc, p) => acc + p.sizes.reduce((sAcc, s) => sAcc + s.quantity, 0),
    0
  );

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      activeOrders,
      averageOrderValue,
      totalStockUnits,
      productCatalogCount: productsDb.length,
      customersCount: customersDb.length,
    },
  });
});

// ==========================================
// VITE INTEGRATION (DEV & PROD)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Verciano Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
