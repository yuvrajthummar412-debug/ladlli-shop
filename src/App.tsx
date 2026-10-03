import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Customer, FilterState, ProductColor } from './types/index.ts';
import { apiService } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductListing } from './components/ProductListing.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { WishlistDrawer } from './components/WishlistDrawer.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { BrandPhilosophy } from './components/BrandPhilosophy.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart & Wishlist state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('verciano_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('verciano_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    selectedSizes: [],
    selectedColors: [],
    priceRange: [0, 25000],
    inStockOnly: false,
    searchQuery: '',
    sortBy: 'featured',
  });

  // Modal / Drawer Toggles
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('verciano_cart_items', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('verciano_wishlist_ids', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Load initial data from API
  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, orderList, custList] = await Promise.all([
          apiService.getProducts(),
          apiService.getOrders(),
          apiService.getCustomers(),
        ]);
        setProducts(prodList);
        setOrders(orderList);
        setCustomers(custList);
      } catch (err) {
        console.error('Failed to load initial atelier data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color: ProductColor,
    quantity = 1
  ) => {
    const lineId = `${product.id}-${size}-${color.name}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} (${size}) to Shopping Bag`);
  };

  const handleQuickAdd = (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    handleAddToCart(product, size, product.colors[0], 1);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleApplyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUXURY10' || clean === 'ATELIER10') {
      setDiscountPercent(10);
      showToast('Atelier 10% Privilege Applied');
      return true;
    }
    return false;
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from saved pieces`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to curations`);
        return [...prev, product.id];
      }
    });
  };

  // Instant Buy Now from PDP
  const handleBuyNow = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color: ProductColor,
    quantity = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Order Placement Success Handler
  const handleOrderSuccess = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // Clear cart
    // Refresh products to reflect decremented stock
    const freshProducts = await apiService.getProducts();
    setProducts(freshProducts);
    const freshCustomers = await apiService.getCustomers();
    setCustomers(freshCustomers);
  };

  // Admin CRUD operations
  const handleAddProduct = async (newProd: Partial<Product>) => {
    const created = await apiService.createProduct(newProd);
    setProducts((prev) => [created, ...prev]);
    showToast(`Added ${created.name} to active catalog`);
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await apiService.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Updated ${updated.name}`);
  };

  const handleDeleteProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Garment removed from catalog`);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered'
  ) => {
    const updated = await apiService.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    showToast(`Order ${updated.orderNumber} status set to ${status}`);
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f2efe9] flex flex-col font-sans-clean selection:bg-[#f5cf68] selection:text-[#0c0c0e]">
      
      {/* Toast Notification Bar with Gold Accents */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16140e] text-[#fff6d6] border border-[#f5cf68]/50 px-4 py-2.5 rounded-sm shadow-[0_0_24px_rgba(245,207,104,0.25)] text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
          <span className="gold-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onSelectCategory={(cat) => {
          setFilters((prev) => ({ ...prev, category: cat }));
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={filters.category}
      />

      {/* Main Storefront Body */}
      <main className="flex-1">
        {/* Editorial Cinematic Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onCategoryClick={(category) => {
            setFilters((prev) => ({ ...prev, category }));
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Brand Philosophy Section */}
        <BrandPhilosophy
          onCategoryClick={(category) => {
            setFilters((prev) => ({ ...prev, category }));
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Product Catalog & Faceted Filters */}
        <ProductListing
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAdd}
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </main>

      {/* Footer */}
      <Footer
        onCategoryClick={(category) => {
          setFilters((prev) => ({ ...prev, category }));
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedDiscount={discountPercent}
        onApplyPromo={handleApplyPromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountPercent={discountPercent}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Admin Executive Suite */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        customers={customers}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Full-Stack Architecture & Database Inspector Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

    </div>
  );
}
