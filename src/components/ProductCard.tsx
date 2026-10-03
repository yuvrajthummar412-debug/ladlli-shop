import React from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types/index.ts';
import { GarmentVisual } from './GarmentVisual.tsx';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  // Find primary color or first available
  const primaryColorHex = product.colors[0]?.hex || '#1a191e';

  // Calculate available sizes
  const availableSizes = product.sizes.filter(s => s.quantity > 0);
  const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className="group relative flex flex-col bg-[#121115] border border-[#201f25] hover:border-[#f5cf68]/50 rounded-sm transition-all duration-300 hover:shadow-xl hover:shadow-[0_10px_30px_rgba(245,207,104,0.1)]">
      
      {/* Lead with Imagery Container */}
      <div 
        className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-[#141317]"
        onClick={() => onSelectProduct(product)}
      >
        <GarmentVisual
          category={product.category}
          name={product.name}
          colorHex={primaryColorHex}
          imageUrl={product.images && product.images.length > 0 ? product.images[0] : undefined}
          aspect="3:4"
        />

        {/* Wishlist Affordance Button with Gold Active */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md ${
            isWishlisted
              ? 'bg-gold-gradient text-[#0c0c0e] shadow-[0_0_10px_rgba(245,207,104,0.5)]'
              : 'bg-[#0c0c0e]/60 text-[#d1c9bd] hover:text-[#fae28e] hover:bg-[#0c0c0e]/90 hover:border hover:border-[#f5cf68]/40'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={14} className="sm:w-4 sm:h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Subtle Status Tag with Gold Dot */}
        {product.isNew && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0c0c0e]/85 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium text-[#f5cf68] border border-[#f5cf68]/30 flex items-center gap-1 sm:gap-1.5 shadow-sm">
            <span className="gold-dot"></span>
            <span>New</span>
          </div>
        )}

        {totalStock <= 3 && totalStock > 0 && (
          <div className="absolute bottom-12 sm:bottom-14 left-2 sm:left-3 bg-[#381a17]/90 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] tracking-wider text-[#f5a198] border border-red-900/40">
            Only {totalStock} Left
          </div>
        )}

        {/* Hover Quick-Size Selector Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/85 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1.5 sm:gap-2">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gold text-center font-medium flex items-center justify-center gap-1.5">
            <span className="gold-dot"></span>
            <span>Quick Add Size</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.quantity === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product, s.size);
                }}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-xs transition-all ${
                  s.quantity > 0
                    ? 'bg-[#23222a] hover:bg-gold-gradient hover:text-[#0c0c0e] text-[#f2efe9] border border-[#35333f] hover:border-[#f5cf68]'
                    : 'bg-[#151418] text-[#55525d] line-through cursor-not-allowed'
                }`}
                title={s.quantity > 0 ? `${s.quantity} available` : 'Out of stock'}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div className="space-y-0.5 sm:space-y-1">
          {/* Category & Material Kicker with Gold Indicator */}
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#8e877c] font-medium flex items-center justify-between">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span className="gold-dot"></span>
              <span className="text-[#c4bcad] truncate max-w-[80px] sm:max-w-none">{product.category}</span>
            </span>
            <span className="text-[#a59d8f] hidden xs:inline">{product.fitType}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-sm font-medium text-[#f2efe9] hover:text-gold transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-[#7e786e] line-clamp-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Color Swatches and Price Row */}
        <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-[#1d1c22]">
          {/* Color Indicator Dots */}
          <div className="flex items-center gap-1 sm:gap-1.5" title={product.colors.map(c => c.name).join(', ')}>
            {product.colors.slice(0, 3).map((c, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black/50"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-[#716b61]">+{product.colors.length - 3}</span>
            )}
          </div>

          {/* Tabular Price in Gold */}
          <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
            <span className="text-xs sm:text-sm font-bold text-gold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-[#6e685f] line-through hidden sm:inline">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
