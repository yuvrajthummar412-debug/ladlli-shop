import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, FilterState } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';

interface ProductListingProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export const ProductListing: React.FC<ProductListingProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  filters,
  onFilterChange,
}) => {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_PER_PAGE = 4; // 4 items = 2 lines of 2 on mobile; 8 items = 2 pages; 9 items = 3 pages

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const categories = [
    { id: 'all', name: 'All Pieces' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'knitwear', name: 'Nightwear' },
    { id: 'shirts', name: 'Shirts & Polos' },
    { id: 'trousers', name: 'Trousers' },
    { id: 'essentials', name: 'Essentials' },
  ];

  const allSizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleSizeToggle = (size: string) => {
    const exists = filters.selectedSizes.includes(size);
    const updated = exists
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onFilterChange({ ...filters, selectedSizes: updated });
  };

  const handleResetFilters = () => {
    onFilterChange({
      category: 'all',
      selectedSizes: [],
      selectedColors: [],
      priceRange: [0, 25000],
      inStockOnly: false,
      searchQuery: '',
      sortBy: 'featured',
    });
  };

  // Filtered array calculation
  let filtered = [...products];

  if (filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.selectedSizes.length > 0) {
    filtered = filtered.filter((p) =>
      p.sizes.some((s) => filters.selectedSizes.includes(s.size) && s.quantity > 0)
    );
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.sizes.some((s) => s.quantity > 0));
  }

  filtered = filtered.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q))
    );
  }

  // Sorting
  switch (filters.sortBy) {
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

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20">
      
      {/* Editorial Category Header & Subtitle with Gold Accents */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-[#212028]">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium flex items-center gap-1.5">
            <span className="gold-half-dot"></span>
            <span>LADLLI Ready-to-Wear</span>
          </span>
          <h2 className="font-serif-display text-2xl sm:text-4xl text-[#f5f2ec] font-normal mt-1">
            Curated Menswear Collection
          </h2>
        </div>

        {/* Clean Segmented Category Bar: Arranged in 2 balanced lines on mobile, single row on desktop */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 sm:p-1 bg-[#141318] border border-[#23222a] rounded-sm w-full md:w-auto md:flex md:items-center md:gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.id })}
              className={`py-2 px-2 sm:px-4 text-[11px] sm:text-xs uppercase tracking-wider font-semibold rounded-xs transition-all text-center flex items-center justify-center md:whitespace-nowrap ${
                filters.category === cat.id
                  ? 'bg-gold-gradient text-[#0c0c0e] font-bold shadow-[0_0_12px_rgba(245,207,104,0.35)]'
                  : 'text-[#9c9588] hover:text-[#f2efe9] hover:bg-[#1c1b22]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Controls Toolbar */}
      <div className="flex items-center justify-between py-5 text-xs text-[#a0998d]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-colors ${
              showFilterDrawer || filters.selectedSizes.length > 0 || filters.inStockOnly
                ? 'border-[#f5cf68] text-gold bg-[#1c1a14] shadow-[0_0_10px_rgba(245,207,104,0.2)]'
                : 'border-[#292832] bg-[#131217] text-[#9c9588] hover:text-[#f2efe9]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Refine & Sizes</span>
            {(filters.selectedSizes.length > 0 || filters.inStockOnly) && (
              <span className="gold-dot"></span>
            )}
          </button>

          {(filters.selectedSizes.length > 0 || filters.category !== 'all' || filters.inStockOnly) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] text-[#7d776f] hover:text-[#f2efe9] transition-colors"
            >
              <RotateCcw size={11} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Results Count & Sort Dropdown */}
        <div className="flex items-center gap-4">
          <span className="font-mono tabular-nums text-[#847e74] hidden sm:inline">
            Showing {filtered.length} garments
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={13} className="text-[#847e74]" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-[#131217] border border-[#292832] text-[#d4cebe] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#d4a373]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Faceted Filter Drawer */}
      {showFilterDrawer && (
        <div className="p-6 bg-[#131217] border border-[#272630] rounded-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-xs">
          
          {/* Size Filter */}
          <div className="space-y-2">
            <span className="text-[#e2dbce] font-medium uppercase tracking-wider block">
              Ready-Made Size
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {allSizes.map((sz) => {
                const isSelected = filters.selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => handleSizeToggle(sz)}
                    className={`w-10 h-9 rounded-sm border text-xs font-semibold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-[#d4a373] bg-[#e5dfd3] text-[#0c0c0e]'
                        : 'border-[#2e2d38] bg-[#19181f] text-[#a9a296] hover:border-[#524f60]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[#e2dbce] font-medium uppercase tracking-wider">
              <span>Max Price</span>
              <span className="font-mono tabular-nums text-[#d4a373]">
                ₹{filters.priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="25000"
              step="500"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-full accent-[#d4a373] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7d776f] font-mono">
              <span>₹3,000</span>
              <span>₹25,000</span>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2 flex flex-col justify-center">
            <label className="flex items-center gap-2.5 cursor-pointer text-[#d4cebe] hover:text-[#f2efe9]">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded-xs accent-[#d4a373] bg-[#1a1920] border-[#363442]"
              />
              <span>In-Stock Ready-Made Only (Ships within 24h)</span>
            </label>
          </div>

        </div>
      )}

      {/* Grid of Product Cards */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#111014] border border-[#222129] rounded-sm">
          <p className="text-base text-[#cfc7b9] font-serif-display">No matching luxury garments found</p>
          <p className="text-xs text-[#7e786d]">Try adjusting your category, price range, or ready-made sizing filters.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 mt-2 bg-[#23222a] hover:bg-[#34323e] text-[#f2efe9] text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          {/* 2 Products Per Line (2 Columns) on Mobile, 3-4 Columns on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
              const safePage = Math.min(currentPage, totalPages);
              const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
              const paginatedProducts = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

              return paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ));
            })()}
          </div>

          {/* Luxury Atelier Pagination Controls */}
          {filtered.length > PRODUCTS_PER_PAGE && (
            <div className="mt-10 sm:mt-14 pt-6 border-t border-[#222129] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              {(() => {
                const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
                const safePage = Math.min(currentPage, totalPages);
                const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;

                const handlePageChange = (newPage: number) => {
                  setCurrentPage(newPage);
                  const catalogElement = document.getElementById('catalog');
                  if (catalogElement) {
                    catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                };

                return (
                  <>
                    <span className="text-xs text-[#8e877c] font-mono tabular-nums">
                      Page <strong className="text-[#f5f2ec]">{safePage}</strong> of <strong className="text-[#f5f2ec]">{totalPages}</strong> · Showing {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} garments
                    </span>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Prev Button */}
                      <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() => handlePageChange(safePage - 1)}
                        className={`px-3 py-2 rounded-xs border text-xs font-semibold flex items-center gap-1 transition-all ${
                          safePage === 1
                            ? 'border-[#201f27] text-[#4d4a54] cursor-not-allowed opacity-40'
                            : 'border-[#2d2c39] bg-[#141318] text-[#c9c3b6] hover:text-[#f2efe9] hover:border-[#f5cf68]/50 active:scale-95'
                        }`}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={14} />
                        <span className="hidden xs:inline">Prev</span>
                      </button>

                      {/* Numeric Page Buttons */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xs text-xs font-bold font-mono transition-all flex items-center justify-center ${
                            safePage === pageNum
                              ? 'bg-gold-gradient text-[#0c0c0e] shadow-[0_0_12px_rgba(245,207,104,0.35)] scale-105 border border-[#fff3c4]/40'
                              : 'border border-[#282733] bg-[#131217] text-[#938c7f] hover:text-[#f2efe9] hover:border-[#3e3c4e] active:scale-95'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      {/* Next Button */}
                      <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() => handlePageChange(safePage + 1)}
                        className={`px-3 py-2 rounded-xs border text-xs font-semibold flex items-center gap-1 transition-all ${
                          safePage === totalPages
                            ? 'border-[#201f27] text-[#4d4a54] cursor-not-allowed opacity-40'
                            : 'border-[#2d2c39] bg-[#141318] text-[#c9c3b6] hover:text-[#f2efe9] hover:border-[#f5cf68]/50 active:scale-95'
                        }`}
                        aria-label="Next page"
                      >
                        <span className="hidden xs:inline">Next</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}

    </section>
  );
};
