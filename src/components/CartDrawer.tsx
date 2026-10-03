import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types/index.ts';
import { GarmentVisual } from './GarmentVisual.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedDiscount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedDiscount,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 5000;
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 450;
  const total = subtotal - discountAmount + shippingFee;

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim());
    if (ok) {
      setPromoMessage({ text: 'Atelier 10% privilege applied.', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid code. Use code LUXURY10 or ATELIER10', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-[#0f0e12] border-l border-[#24232c] flex flex-col justify-between shadow-2xl h-full animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#212028] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="gold-dot"></span>
            <h3 className="font-serif-display text-xl text-[#f5f2eb]">Shopping Bag</h3>
            <span className="text-xs text-[#8f887c] font-mono tabular-nums">
              ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9e968a] hover:text-[#f2efe9] rounded-md transition-colors"
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-[#141318] border-b border-[#201f26] space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#c4bcaa]">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="text-gold font-semibold flex items-center gap-1.5">
                <span className="gold-dot"></span>
                <span>You unlocked Complimentary Express Air Shipping!</span>
              </span>
            ) : (
              <span>
                Add <strong className="text-gold font-mono">₹{amountNeeded.toLocaleString('en-IN')}</strong> more for Free Delivery
              </span>
            )}
            <span className="font-mono text-gold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#25242d] rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-gradient transition-all duration-500 shadow-[0_0_8px_rgba(245,207,104,0.7)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Itemized Garment List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <p className="text-base text-[#d4cebe] font-serif-display">Your bag is currently empty</p>
              <p className="text-xs text-[#7e786e]">Explore our latest ready-made autumnal collection.</p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2.5 bg-[#e5dfd3] text-[#0c0c0e] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-white transition-colors"
              >
                Discover Pieces
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-[#131216] border border-[#212028] rounded-sm relative group"
              >
                {/* Visual Thumbnail */}
                <div className="w-20 aspect-[3/4] shrink-0 rounded-xs overflow-hidden border border-[#2c2b36]">
                  <GarmentVisual
                    category={item.product.category}
                    name={item.product.name}
                    colorHex={item.selectedColor.hex}
                    imageUrl={item.product.images && item.product.images.length > 0 ? item.product.images[0] : undefined}
                    aspect="3:4"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-medium text-[#f2efe9] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#6d665c] hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex items-center gap-2 text-[11px] text-[#9a9387]">
                      <span className="bg-[#1e1d24] px-1.5 py-0.5 rounded-xs text-[#d6cec0] border border-[#2a2933]">
                        Size: {item.selectedSize}
                      </span>
                      <span>·</span>
                      <span>{item.selectedColor.name}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper and Item Total */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#2f2e3a] bg-[#18171d] rounded-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-white transition-colors text-[#a39c90]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium text-[#f2efe9]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-white transition-colors text-[#a39c90]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="font-mono tabular-nums text-xs font-semibold text-[#f5f2ec]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#212028] bg-[#121115] space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={12} className="absolute left-2.5 top-3 text-[#7d776f]" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Privilege Code (try LUXURY10)"
                    className="w-full bg-[#17161b] border border-[#292832] pl-8 pr-2.5 py-2 text-xs text-[#f2efe9] uppercase placeholder:normal-case placeholder:text-[#6e685f] rounded-xs focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#25242c] hover:bg-[#34333e] text-[#f2efe9] text-xs rounded-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#9d968b] border-t border-[#1f1e26] pt-3 font-mono tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#e2dbce]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Atelier Privilege ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier</span>
                <span className="text-[#e2dbce]">
                  {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gold pt-2 border-t border-[#23222a]">
                <span className="font-sans font-medium uppercase tracking-wider text-xs text-[#f2efe9]">Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,207,104,0.35)] hover:translate-y-[-1px] border border-[#fff3c4]/40"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#716c63]">
              <ShieldCheck size={13} className="text-[#d4a373]" />
              <span>256-bit Encrypted Checkout · Instant Tracking</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
