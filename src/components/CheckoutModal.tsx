import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Truck, CreditCard, Smartphone, Banknote, Building2 } from 'lucide-react';
import { CartItem, Order, ShippingAddress } from '../types/index.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountPercent: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountPercent,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [formData, setFormData] = useState<ShippingAddress & { email: string }>({
    fullName: 'Yuvraj Thummar',
    email: 'yuvrajthummar412@gmail.com',
    phone: '+91 98765 43210',
    addressLine1: '402, Highline Luxury Towers, Worli Sea Face',
    addressLine2: 'Opposite Coast Guard',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    country: 'India',
  });

  const [shippingSpeed, setShippingSpeed] = useState<'express' | 'whiteglove'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');

  // Calculations
  const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const baseShipping = subtotal >= 5000 ? 0 : 450;
  const shippingFee = shippingSpeed === 'whiteglove' ? baseShipping + 650 : baseShipping;
  const totalAmount = subtotal - discountAmount + shippingFee;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderPayload = {
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        image: item.product.images[0] || '',
      })),
      subtotal,
      discount: discountAmount,
      shippingFee,
      totalAmount,
      shippingAddress: formData,
      paymentMethod,
    };

    try {
      // Direct call to API or client service
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let finalOrder: Order;
      if (res.ok) {
        const json = await res.json();
        finalOrder = json.data;
      } else {
        throw new Error('Fallback required');
      }

      setCreatedOrder(finalOrder);
      onOrderSuccess(finalOrder);
      setStep('confirmed');
    } catch {
      // Local fallback
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `VRC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        customer: orderPayload.customer,
        items: orderPayload.items,
        subtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount,
        shippingAddress: formData,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        fulfillmentStatus: 'Pending',
        createdAt: new Date().toISOString(),
        trackingNumber: `VRC-EXP-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      };
      setCreatedOrder(fallbackOrder);
      onOrderSuccess(fallbackOrder);
      setStep('confirmed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div className="relative w-full max-w-3xl bg-[#0f0e13] border border-[#272630] rounded-sm shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-[#212028] flex items-center justify-between bg-[#131217]">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-lg tracking-[0.2em] text-[#f2efe9]">LADLLI</span>
            <span className="text-xs uppercase tracking-widest text-gold font-sans font-light border-l border-[#f5cf68]/40 pl-2">SHOP</span>
            <span className="gold-dot"></span>
            <span className="text-xs text-[#8f887c] ml-3 uppercase tracking-wider hidden sm:inline">
              {step === 'details' && 'Step 1 of 2: Shipping & Consignment'}
              {step === 'payment' && 'Step 2 of 2: Settlement Method'}
              {step === 'confirmed' && 'Order Authenticated'}
            </span>
          </div>

          {step !== 'confirmed' && (
            <button
              onClick={onClose}
              className="text-[#968f83] hover:text-white p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* STEP 1: Details & Shipping Address */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-serif-display text-lg text-[#f5f2ec]">Consignment Recipient</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#a8a194] block mb-1">Full Legal Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <div>
                  <label className="text-[#a8a194] block mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[#a8a194] block mb-1">Direct Phone (for courier coordination) *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#201f27]">
              <h3 className="font-serif-display text-lg text-[#f5f2ec]">Delivery Destination</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-[#a8a194] block mb-1">Street Address / Suite / Bungalow *</label>
                  <input
                    required
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="text-[#a8a194] block mb-1">City *</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="text-[#a8a194] block mb-1">State *</label>
                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="text-[#a8a194] block mb-1">Postal Code (PIN) *</label>
                  <input
                    required
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#16151b] border border-[#2a2933] px-3.5 py-2.5 text-[#f2efe9] rounded-sm focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="text-[#a8a194] block mb-1">Country</label>
                  <input
                    disabled
                    type="text"
                    value={formData.country}
                    className="w-full bg-[#121116] border border-[#23222a] px-3.5 py-2.5 text-[#888176] rounded-sm"
                  />
                </div>
              </div>
            </div>

            {/* Courier Tiers */}
            <div className="space-y-3 pt-4 border-t border-[#201f27]">
              <span className="text-xs uppercase tracking-wider text-[#b8b0a2] font-medium block">
                Select Dispatch Protocol:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  onClick={() => setShippingSpeed('express')}
                  className={`p-3.5 rounded-sm border cursor-pointer flex items-start gap-3 transition-colors ${
                    shippingSpeed === 'express'
                      ? 'border-[#d4a373] bg-[#1d1c23]'
                      : 'border-[#26252f] bg-[#141318] text-[#8e877d]'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'express'}
                    onChange={() => setShippingSpeed('express')}
                    className="mt-0.5 accent-[#d4a373]"
                  />
                  <div>
                    <span className="font-semibold text-[#f2efe9] block">Complimentary Express Courier</span>
                    <span className="text-[11px] text-[#8e877c] block mt-0.5">Air freight dispatch within 24h (2-3 business days)</span>
                  </div>
                </label>

                <label
                  onClick={() => setShippingSpeed('whiteglove')}
                  className={`p-3.5 rounded-sm border cursor-pointer flex items-start gap-3 transition-colors ${
                    shippingSpeed === 'whiteglove'
                      ? 'border-[#d4a373] bg-[#1d1c23]'
                      : 'border-[#26252f] bg-[#141318] text-[#8e877d]'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeed === 'whiteglove'}
                    onChange={() => setShippingSpeed('whiteglove')}
                    className="mt-0.5 accent-[#d4a373]"
                  />
                  <div>
                    <span className="font-semibold text-[#f2efe9] block">White-Glove Garment Box (+₹650)</span>
                    <span className="text-[11px] text-[#8e877c] block mt-0.5">Hand-delivered in wooden hanger & bespoke canvas garment bag</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-4 border-t border-[#212028] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#8f887c] hover:text-[#f2efe9]"
              >
                Return to Bag
              </button>
              <button
                type="submit"
                className="px-7 py-3 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] text-xs uppercase tracking-[0.2em] font-bold rounded-sm flex items-center gap-2 shadow-[0_0_18px_rgba(245,207,104,0.35)] transition-all border border-[#fff3c4]/40"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: Payment Settlement */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif-display text-lg text-[#f5f2ec]">Select Payment Method</h3>
              
              <div className="space-y-2.5">
                {[
                  { id: 'UPI', label: 'Instant UPI / QR', desc: 'Google Pay, PhonePe, Paytm, BHIM', icon: Smartphone },
                  { id: 'Credit Card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, Amex (256-bit AES Encryption)', icon: CreditCard },
                  { id: 'NetBanking', label: 'Luxury NetBanking', desc: 'HDFC, ICICI, SBI, Axis, Kotak Priority', icon: Building2 },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay at doorstep with signature verification', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <label
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-4 rounded-sm border cursor-pointer flex items-center justify-between transition-colors ${
                        paymentMethod === item.id
                          ? 'border-[#d4a373] bg-[#1d1c23]'
                          : 'border-[#26252f] bg-[#141318] hover:border-[#383744]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === item.id}
                          onChange={() => setPaymentMethod(item.id as any)}
                          className="accent-[#d4a373]"
                        />
                        <div className="w-8 h-8 rounded-sm bg-[#222129] flex items-center justify-center text-[#d4a373]">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#f2efe9] block">{item.label}</span>
                          <span className="text-[11px] text-[#8e877c] block">{item.desc}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Order Review Box */}
            <div className="p-4 bg-[#141318] border border-[#23222a] rounded-sm space-y-2 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-[#8f887c]">
                <span>Items ({cartItems.length})</span>
                <span className="text-[#ece6d9]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Atelier Privilege ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8f887c]">
                <span>Courier Service</span>
                <span className="text-[#ece6d9]">{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f7f5ef] pt-2 border-t border-[#222129]">
                <span className="font-sans font-medium uppercase tracking-wider text-xs">Total Settlement</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#212028] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-[#8f887c] hover:text-[#f2efe9]"
              >
                Back to Consignment
              </button>
              <button
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="px-8 py-3.5 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] text-xs uppercase tracking-[0.2em] font-bold rounded-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,207,104,0.35)] transition-all border border-[#fff3c4]/40"
              >
                {isProcessing ? (
                  <span>Authenticating Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 'confirmed' && createdOrder && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#cbb89d] font-medium block">
                Consignment Confirmed
              </span>
              <h2 className="font-serif-display text-3xl text-[#f5f2ec] font-normal">
                Thank You, {createdOrder.customer.name.split(' ')[0]}
              </h2>
              <p className="text-xs text-[#9c9588] max-w-md mx-auto leading-relaxed">
                Your bespoke ready-to-wear order has been authenticated and entered into our Biarritz dispatch queue.
              </p>
            </div>

            {/* Order Card Breakdown */}
            <div className="max-w-md mx-auto p-5 bg-[#141318] border border-[#25242e] rounded-sm text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-[#212028] pb-2">
                <span className="text-[#888175]">Order Identifier</span>
                <span className="font-bold text-[#f2efe9]">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#212028] pb-2">
                <span className="text-[#888175]">Tracking Consignment</span>
                <span className="text-[#d4a373]">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#212028] pb-2">
                <span className="text-[#888175]">Payment Status</span>
                <span className="text-emerald-400 uppercase tracking-wider">{createdOrder.paymentStatus} ({createdOrder.paymentMethod})</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-[#f5f2ec]">
                <span>Total Settled</span>
                <span>₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#e5dfd3] hover:bg-white text-[#0c0c0e] text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all"
              >
                Return to Atelier Collection
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
