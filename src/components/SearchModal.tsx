import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types/index.ts';
import { GarmentVisual } from './GarmentVisual.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.materials.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-8 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111015] border border-[#272632] rounded-sm shadow-2xl overflow-hidden mt-12">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#21202a] flex items-center gap-3 bg-[#15141b]">
          <Search size={18} className="text-[#a8a194] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ready-to-wear garments, cashmere, linen, trousers..."
            className="w-full bg-transparent text-sm text-[#f2efe9] placeholder:text-[#6a655c] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#8f887c] hover:text-[#f2efe9] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="text-[11px] uppercase tracking-wider text-[#7d776f] font-medium">
            {query.trim() ? `Search Results (${results.length})` : 'Curated Highlights'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8f887c]">
              No garments found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 bg-[#15141a] hover:bg-[#1f1e27] border border-[#23222b] rounded-sm cursor-pointer transition-colors group"
              >
                <div className="w-14 aspect-[3/4] shrink-0 rounded-xs overflow-hidden border border-[#2a2933]">
                  <GarmentVisual
                    category={product.category}
                    name={product.name}
                    colorHex={product.colors[0]?.hex}
                    imageUrl={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    aspect="3:4"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-[#8e877c]">
                    {product.category} · {product.fitType}
                  </div>
                  <h4 className="text-xs font-semibold text-[#f2efe9] truncate group-hover:text-[#d4a373] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-[#7d776f] truncate">{product.subtitle}</p>
                </div>

                <div className="flex items-center gap-3 font-mono tabular-nums text-xs font-bold text-[#f7f5ef]">
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                  <ArrowRight size={13} className="text-[#8f887c] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
