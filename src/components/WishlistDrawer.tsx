import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types/index.ts';
import { GarmentVisual } from './GarmentVisual.tsx';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-md bg-[#0f0e13] border-l border-[#24232c] flex flex-col justify-between shadow-2xl h-full animate-slide-left">
        
        {/* Header */}
        <div className="p-6 border-b border-[#212028] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif-display text-xl text-[#f5f2eb]">Saved Curations</h3>
            <span className="text-xs text-[#8f887c] font-mono tabular-nums">
              ({wishlistProducts.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9e968a] hover:text-[#f2efe9] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <p className="text-base text-[#d4cebe] font-serif-display">No saved pieces</p>
              <p className="text-xs text-[#7e786e]">Save pieces to review sizing and availability later.</p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 bg-[#131216] border border-[#212028] rounded-sm group"
              >
                <div 
                  className="w-20 aspect-[3/4] shrink-0 rounded-xs overflow-hidden border border-[#2c2b36] cursor-pointer"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                >
                  <GarmentVisual
                    category={product.category}
                    name={product.name}
                    colorHex={product.colors[0]?.hex}
                    imageUrl={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    aspect="3:4"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="text-xs font-medium text-[#f2efe9] line-clamp-1 cursor-pointer hover:text-[#d4a373]"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-[#6d665c] hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8e877c] font-mono tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quick Add Available Size */}
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#7d776f]">Add:</span>
                    {product.sizes.filter(s => s.quantity > 0).slice(0, 3).map((s) => (
                      <button
                        key={s.size}
                        onClick={() => onQuickAdd(product, s.size)}
                        className="px-2 py-0.5 bg-[#212028] hover:bg-[#e5dfd3] hover:text-[#0c0c0e] text-[10px] text-[#f2efe9] rounded-xs border border-[#333240] transition-colors"
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#212028] bg-[#121115] text-center text-xs text-[#7d776f]">
          Items remain reserved in wishlist without expiration.
        </div>

      </div>
    </div>
  );
};
