import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenArchitecture: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin,
  onOpenArchitecture,
  onSelectCategory,
  activeCategory,
}) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-[#222126]">
      {/* Slim Promotional Announcement Bar */}
      {showBanner && (
        <div className="bg-[#151418] border-b border-[#232228] px-4 py-1.5 text-center text-xs tracking-wider text-[#b8afa3] flex items-center justify-between">
          <div className="mx-auto flex items-center gap-2">
            <span className="gold-dot"></span>
            <span>LADLLI SHOP · COMPLIMENTARY WHITE-GLOVE EXPRESS DISPATCH ON ORDERS ABOVE ₹4,999</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#7d776f] hover:text-[#f2efe9] transition-colors p-0.5"
            aria-label="Dismiss banner"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-cinzel text-xl sm:text-2xl lg:text-3xl tracking-[0.2em] sm:tracking-[0.25em] text-[#f4f1ea] hover:text-[#fae28e] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span>LADLLI</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#f5cf68] font-sans font-light hidden sm:inline border-l border-[#d4af37]/40 pl-2">
            SHOP
          </span>
          <span className="gold-dot shrink-0 animate-pulse ml-0.5" />
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#a9a296]">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'all' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            All Pieces
          </button>
          <button
            onClick={() => onSelectCategory('outerwear')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'outerwear' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            Outerwear
          </button>
          <button
            onClick={() => onSelectCategory('knitwear')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'knitwear' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            Nightwear
          </button>
          <button
            onClick={() => onSelectCategory('shirts')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'shirts' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            Shirts & Polos
          </button>
          <button
            onClick={() => onSelectCategory('trousers')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'trousers' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            Trousers
          </button>
          <button
            onClick={() => onSelectCategory('essentials')}
            className={`transition-colors hover:text-[#f2efe9] py-1 ${
              activeCategory === 'essentials' ? 'text-gold font-semibold border-b border-[#f5cf68]' : ''
            }`}
          >
            Essentials
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions and tools */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2 text-[#b0a99e] hover:text-[#f2efe9] transition-colors rounded-lg hover:bg-[#1a191f]"
            aria-label="Search Collection"
            title="Search garments"
          >
            <Search size={17} />
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-1.5 sm:p-2 text-[#b0a99e] hover:text-[#f2efe9] transition-colors rounded-lg hover:bg-[#1a191f] relative"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart size={17} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-gold-gradient text-[#0c0c0e] text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(245,207,104,0.6)]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={onOpenCart}
            className="p-1.5 sm:p-2 text-[#b0a99e] hover:text-[#f2efe9] transition-colors rounded-lg hover:bg-[#1a191f] relative"
            aria-label="Shopping Bag"
            title="View Bag"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-gold-gradient text-[#0c0c0e] text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(245,207,104,0.6)]">
                {cartCount}
              </span>
            )}
          </button>

          <div className="h-4 w-[1px] bg-[#27262d] mx-1 hidden sm:block" />

          {/* Admin Suite Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold text-[#0c0c0e] bg-gold-gradient hover:opacity-95 rounded-md transition-all shadow-[0_0_14px_rgba(245,207,104,0.3)] whitespace-nowrap shrink-0 border border-[#fff3c4]/30"
            aria-label="Admin Suite"
            title="Admin Suite"
          >
            <ShieldCheck size={14} className="shrink-0" />
            <span className="hidden sm:inline">Admin Suite</span>
            <span className="inline sm:hidden text-[11px] font-semibold">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
