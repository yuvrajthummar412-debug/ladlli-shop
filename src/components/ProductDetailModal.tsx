import React, { useState } from 'react';
import { X, Check, ShieldCheck, Ruler, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Product, ProductColor } from '../types/index.ts';
import { GarmentVisual } from './GarmentVisual.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', color: ProductColor, quantity: number) => void;
  onBuyNow: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', color: ProductColor, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>(() => {
    const firstInStock = product.sizes.find(s => s.quantity > 0);
    return firstInStock ? firstInStock.size : 'M';
  });

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Sizing Calculator state
  const [calcHeight, setCalcHeight] = useState<string>('178');
  const [calcWeight, setCalcWeight] = useState<string>('74');
  const [recommendedSize, setRecommendedSize] = useState<string>('');

  const currentSizeObj = product.sizes.find(s => s.size === selectedSize);
  const currentStock = currentSizeObj?.quantity ?? 0;

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(calcHeight);
    const w = Number(calcWeight);
    if (!h || !w) return;

    // Sartorial BMI / ready-made size approximation
    if (w < 65) setRecommendedSize('S');
    else if (w < 76) setRecommendedSize('M');
    else if (w < 86) setRecommendedSize('L');
    else if (w < 96) setRecommendedSize('XL');
    else setRecommendedSize('XXL');
  };

  const handleAdd = () => {
    if (currentStock === 0) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleInstantBuy = () => {
    if (currentStock === 0) return;
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      
      {/* Modal Backdrop click */}
      <div className="relative w-full max-w-5xl bg-[#0f0e12] border border-[#26252e] rounded-sm shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#18171d]/80 text-[#b5ada0] hover:text-white flex items-center justify-center transition-colors border border-white/10"
          aria-label="Close detail modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-6 bg-[#141318] p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#212028]">
            <div className="space-y-4">
              <div className="aspect-[3/4] relative rounded-sm overflow-hidden border border-[#2b2a34]">
                <GarmentVisual
                  category={product.category}
                  name={product.name}
                  colorHex={selectedColor.hex}
                  imageUrl={product.images && product.images.length > 0 ? (product.images[selectedImageIndex] || product.images[0]) : undefined}
                  aspect="3:4"
                />
              </div>

              {/* Multi-Photo Gallery Selector if client uploaded photos */}
              {product.images && product.images.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#8e877c] font-medium block">
                    Garment Angles & Detail ({product.images.length} photos)
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-16 rounded-xs overflow-hidden border transition-all shrink-0 ${
                          selectedImageIndex === idx
                            ? 'border-[#f5cf68] ring-1 ring-[#f5cf68] scale-105'
                            : 'border-[#2c2b36] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector Pills */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#938b7e] font-medium block">
                  Color Shade: <strong className="text-[#f2efe9]">{selectedColor.name}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-all border ${
                        selectedColor.name === c.name
                          ? 'border-[#d4a373] bg-[#222129] text-[#f2efe9]'
                          : 'border-[#2c2b35] bg-[#17161c] text-[#8e877c] hover:text-[#d4cebe]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ready-Made Quality Seal */}
            <div className="mt-6 pt-4 border-t border-[#222128] flex items-center justify-between text-xs text-[#7d776f]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#d4a373]" />
                <span>Pre-washed & Pre-shrunk</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-[#d4a373]" />
                <span>14-Day Complimentary Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#8f887c]">
                <span className="uppercase tracking-[0.25em] font-medium">{product.category} · {product.fitType}</span>
                <div className="flex items-center gap-1 text-[#d4a373]">
                  <span>★</span>
                  <span className="font-semibold text-[#f2efe9]">{product.rating}</span>
                  <span className="text-[#7d776f]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="font-serif-display text-2xl lg:text-3xl text-[#f5f2eb] font-normal leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-[#9a9387] mt-1 font-light">{product.subtitle}</p>

                <div className="flex items-baseline gap-3 mt-3 font-mono tabular-nums">
                  <span className="text-2xl font-bold text-gold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-[#736c61] line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#f5cf68] ml-2 flex items-center gap-1">
                    <span className="gold-dot"></span>
                    <span>Complimentary Express Air Included</span>
                  </span>
                </div>
              </div>

              {/* Ready-Made Size Selector */}
              <div className="space-y-2 pt-2 border-t border-[#222129]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#b3aaa0] font-medium">
                    Select Ready Size:
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#d4a373] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler size={13} />
                    <span>{showSizeGuide ? 'Hide Size Matrix' : 'Size Guide & Estimator'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={s.quantity === 0}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-2.5 text-xs font-semibold rounded-sm transition-all border flex flex-col items-center justify-center ${
                        selectedSize === s.size
                          ? 'border-[#f5cf68] bg-gold-gradient text-[#0c0c0e] font-bold shadow-[0_0_12px_rgba(245,207,104,0.35)]'
                          : s.quantity > 0
                          ? 'border-[#2d2c37] bg-[#16151c] text-[#ece8e0] hover:border-[#676475]'
                          : 'border-[#1b1a20] bg-[#111014] text-[#4f4c57] line-through cursor-not-allowed'
                      }`}
                    >
                      <span>{s.size}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        {s.quantity > 0 ? `${s.quantity} left` : 'Sold out'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Stock Urgency Indicator */}
                {currentStock > 0 && currentStock <= 3 && (
                  <p className="text-xs text-[#f08c7f] tracking-wide flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f08c7f] animate-pulse"></span>
                    <span>High demand: Only {currentStock} units remaining in Size {selectedSize}</span>
                  </p>
                )}
              </div>

              {/* Ready-Made Size Matrix Drawer */}
              {showSizeGuide && (
                <div className="p-4 bg-[#141318] border border-[#2a2933] rounded-sm space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#25242d]">
                    <span className="font-semibold text-[#f2efe9] uppercase tracking-wider">Garment Sizing Matrix</span>
                    <span className="text-[#8e877c]">All garments pre-tailored to precision</span>
                  </div>

                  {/* Size Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono tabular-nums">
                      <thead>
                        <tr className="text-[#888175] border-b border-[#24232c] text-[11px]">
                          <th className="py-1">Size</th>
                          <th className="py-1">Chest</th>
                          <th className="py-1">Shoulder</th>
                          <th className="py-1">Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f1e26] text-[#cec7ba]">
                        {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                          <tr key={sz} className={selectedSize === sz ? 'bg-[#22212a] text-[#f2efe9]' : ''}>
                            <td className="py-1.5 font-bold">{sz}</td>
                            <td className="py-1.5">{product.measurements[sz]?.chest}</td>
                            <td className="py-1.5">{product.measurements[sz]?.shoulder}</td>
                            <td className="py-1.5">{product.measurements[sz]?.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Interactive Size Estimator */}
                  <form onSubmit={handleCalculateSize} className="pt-2 border-t border-[#25242d] space-y-2">
                    <span className="text-[#b1a99d] font-medium block">Find Your Optimal Size:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#7d776f] block">Height (cm)</label>
                        <input
                          type="number"
                          value={calcHeight}
                          onChange={(e) => setCalcHeight(e.target.value)}
                          className="w-full bg-[#1b1a20] border border-[#2f2e3a] px-2.5 py-1 text-xs text-[#f2efe9] rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7d776f] block">Weight (kg)</label>
                        <input
                          type="number"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(e.target.value)}
                          className="w-full bg-[#1b1a20] border border-[#2f2e3a] px-2.5 py-1 text-xs text-[#f2efe9] rounded-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#2b2a35] hover:bg-[#393846] text-[#f2efe9] text-[11px] rounded-sm transition-colors"
                      >
                        Calculate Fit
                      </button>
                      {recommendedSize && (
                        <span className="text-xs text-[#d4a373] font-semibold flex items-center gap-1">
                          <Sparkles size={12} />
                          Recommended: Size {recommendedSize}
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Description & Materials Accordion */}
              <div className="space-y-3 pt-2 text-xs text-[#9d968a] leading-relaxed">
                <p>{product.description}</p>

                <div className="space-y-1 pt-1">
                  <span className="text-[#ded8cd] font-medium block uppercase tracking-wider text-[11px]">
                    Artisanal Sourcing & Composition:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#b0a99c]">
                    {product.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[#ded8cd] font-medium block uppercase tracking-wider text-[11px]">
                    Garment Care:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[#8f887b]">
                    {product.careInstructions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Purchase Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#222129]">
              <div className="grid grid-cols-2 gap-3">
                {/* Add to Bag */}
                <button
                  disabled={currentStock === 0}
                  onClick={handleAdd}
                  className={`py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-200 flex items-center justify-center gap-2 border ${
                    currentStock === 0
                      ? 'bg-[#18171c] text-[#55525e] border-[#25242c] cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-[#1b1a21] hover:bg-[#25242e] text-[#f2efe9] border-[#373543]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={14} />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>

                {/* Instant Buy Now */}
                <button
                  disabled={currentStock === 0}
                  onClick={handleInstantBuy}
                  className={`py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(245,207,104,0.35)] ${
                    currentStock === 0
                      ? 'bg-[#2b2a30] text-[#5e5c68] cursor-not-allowed'
                      : 'bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] hover:translate-y-[-1px] border border-[#fff3c4]/40'
                  }`}
                >
                  <span>Instant Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <p className="text-[11px] text-[#716c64] text-center">
                Dispatched within 24 hours · Standard ready-to-wear sizing
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
