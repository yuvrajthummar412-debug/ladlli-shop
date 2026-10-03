export const FULL_STACK_ARCHITECTURE_DOC = {
  stackRecommendation: {
    frontend: {
      framework: 'Next.js 15 (App Router) / React 19',
      styling: 'Tailwind CSS v4 with custom serif typography & glassmorphism',
      stateManagement: 'Zustand / React Context for lightweight cart, filters & wishlist',
      icons: 'Lucide-React for crisp, minimalist luxury affordances',
      motion: 'Motion (Framer Motion v12) for 60fps micro-interactions',
    },
    backend: {
      runtime: 'Node.js (LTS v22) with Express / Next.js Route Handlers',
      orm: 'Drizzle ORM for type-safe SQL with zero runtime overhead (or Prisma 6)',
      validation: 'Zod for strict request payload schema validation',
      auth: 'Lucia Auth / NextAuth / Iron-Session with Argon2id password hashing',
      storage: 'AWS S3 / Cloudflare R2 with Cloudflare Images CDN for 8K editorial fashion imagery',
    },
    database: {
      primary: 'PostgreSQL 16 on AWS Aurora / Neon / Cloud SQL',
      cache: 'Redis (Upstash / ElastiCache) for session caching, rate-limiting & cart state',
      search: 'PostgreSQL Full-Text Search (tsvector) or Meilisearch for instant menswear querying',
    },
    payments: {
      primary: 'Razorpay / Stripe Payments (Cards, NetBanking, UPI intent)',
      webhooks: 'HMAC SHA-256 signature verification with idempotent database transactions',
    },
  },
  fileTree: `
├── .env.example                     # Environment configuration & keys
├── package.json                     # Dependencies & script runners
├── tsconfig.json                    # Strict TypeScript compiler options
├── drizzle.config.ts                # Drizzle ORM migration configuration
├── server.ts                        # Express API server + SSR / Vite mounting
├── src/
│   ├── app/ (or components/ for SPA)
│   │   ├── layout.tsx               # Root typography, metadata & viewport
│   │   ├── page.tsx                 # Dynamic luxury storefront homepage
│   │   ├── shop/                    # PLP with faceted filtering
│   │   ├── product/[id]/            # PDP with size guide & zoom gallery
│   │   ├── cart/ & checkout/        # Multi-step checkout & payment flows
│   │   └── admin/                   # Executive dashboard & inventory suite
│   ├── components/
│   │   ├── Header.tsx               # Top Bar Contract with single brandmark
│   │   ├── Hero.tsx                 # Editorial cinematic hero + glassmorphism
│   │   ├── ProductCard.tsx          # Minimalist grid card with size reveal
│   │   ├── ProductDetailModal.tsx   # Ready-made size chart & fabric details
│   │   ├── CartDrawer.tsx           # Slide-over bag with free shipping bar
│   │   ├── CheckoutModal.tsx        # Encrypted address & payment flow
│   │   ├── AdminPanel.tsx           # Real-time metrics, CRUD & orders
│   │   └── GarmentVisual.tsx        # Zero-broken-image luxury SVG artwork
│   ├── db/
│   │   ├── schema.sql               # PostgreSQL DDL & constraints
│   │   ├── schema.ts                # Drizzle ORM relational models
│   │   └── mongooseModels.ts        # Mongoose NoSQL document schemas
│   ├── services/
│   │   ├── api.ts                   # Client-side API layer with offline fallback
│   │   └── inventory.ts             # Atomic inventory reservation logic
│   └── types/
│       └── index.ts                 # Full domain TypeScript contracts
└── README.md                        # Deployment & architectural blueprint
  `,
  apiEndpoints: [
    { method: 'GET', path: '/api/products', desc: 'List products with filters (category, size, price, sort)' },
    { method: 'GET', path: '/api/products/:id', desc: 'Retrieve single product with full measurement matrix' },
    { method: 'POST', path: '/api/products', desc: 'Admin: Create new ready-made menswear product' },
    { method: 'PUT', path: '/api/products/:id', desc: 'Admin: Update product details and inventory counts' },
    { method: 'DELETE', path: '/api/products/:id', desc: 'Admin: Soft delete or purge product' },
    { method: 'GET', path: '/api/orders', desc: 'Admin: List all customer orders with filtering' },
    { method: 'POST', path: '/api/orders', desc: 'Customer: Place new order and decrement ready-made stock' },
    { method: 'PATCH', path: '/api/orders/:id/status', desc: 'Admin: Update order fulfillment status' },
    { method: 'GET', path: '/api/customers', desc: 'Admin: List customer directory with VIP spend' },
    { method: 'GET', path: '/api/metrics', desc: 'Admin: Live revenue, order counts, and inventory KPIs' },
  ],
};
