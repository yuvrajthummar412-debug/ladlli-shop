import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onCategoryClick: (category: string) => void;
  onOpenArchitecture: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onCategoryClick,
  onOpenArchitecture,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  return (
    <footer className="bg-[#09080b] border-t border-[#1e1d24] text-[#8e877c] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1c1b22]">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-2xl tracking-[0.25em] text-[#f4f1ea]">
                LADLLI
              </span>
              <span className="text-xs uppercase tracking-widest text-gold font-sans font-light border-l border-[#f5cf68]/40 pl-2">
                SHOP
              </span>
              <span className="gold-dot"></span>
            </div>
            <p className="text-[#a59e91] text-sm font-light max-w-md leading-relaxed">
              Quiet luxury ready-to-wear menswear. Spun from double-faced Italian wools, 
              un-dyed Grade-A cashmere, and Normandy linen. Pre-washed and proportioned to perfection.
            </p>
            <div className="text-[11px] text-[#716c63] flex items-center gap-4 pt-1">
              <span>Milan · Biella</span>
              <span>·</span>
              <span>Biarritz</span>
              <span>·</span>
              <span>London · Mayfair</span>
              <span>·</span>
              <span>Mumbai · Worli</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ded8ce] font-medium block">
              The Atelier Dispatch
            </span>
            <p className="text-[11px] text-[#7a7469]">
              Receive private invitations to limited autumnal releases and seasonal fabric curations.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-[#141318] border border-[#26252f] px-3.5 py-2.5 text-xs text-[#f2efe9] placeholder:text-[#615c54] rounded-sm focus:outline-none focus:border-[#d4a373]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] text-xs font-bold rounded-sm transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_14px_rgba(245,207,104,0.3)] border border-[#fff3c4]/40"
              >
                {subscribed ? (
                  <>
                    <Check size={13} className="text-[#0a0a0c]" />
                    <span>Inscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d4cebe] font-medium">Collections</h4>
            <ul className="space-y-2 text-[#999285]">
              <li>
                <button onClick={() => onCategoryClick('outerwear')} className="hover:text-[#f2efe9] transition-colors">
                  Outerwear & Overshirts
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('knitwear')} className="hover:text-[#f2efe9] transition-colors">
                  Luxury Loungewear & Nightwear
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('shirts')} className="hover:text-[#f2efe9] transition-colors">
                  Normandy Linen & Resort Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('trousers')} className="hover:text-[#f2efe9] transition-colors">
                  Double-Pleated Fresco Trousers
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('essentials')} className="hover:text-[#f2efe9] transition-colors">
                  300gsm Giza Cotton Essentials
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d4cebe] font-medium">Client Concierge</h4>
            <ul className="space-y-2 text-[#999285]">
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Sizing Advisory & Measurements</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Complimentary Courier Protocol</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">14-Day Returns & Exchanges</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Garment Care & Storage Guide</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Order Tracking Portal</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d4cebe] font-medium">Atelier Provenance</h4>
            <ul className="space-y-2 text-[#999285]">
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Our Mills & Weavers (Biella)</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">No-Tailoring Philosophy</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Sustainability & Traceability</span></li>
              <li><span className="hover:text-[#f2efe9] cursor-pointer">Private Appointments</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d4cebe] font-medium">Platform & Admin</h4>
            <ul className="space-y-2 text-[#999285]">
              <li>
                <button
                  onClick={onOpenArchitecture}
                  className="text-[#d4a373] hover:underline flex items-center gap-1 font-medium"
                >
                  PostgreSQL & Schema Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#f2efe9] transition-colors text-left"
                >
                  Admin Inventory Suite
                </button>
              </li>
              <li>
                <span className="text-[#68635a]">REST API (/api/products)</span>
              </li>
              <li>
                <span className="text-[#68635a]">Razorpay / Stripe Webhooks</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#18171d] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#635e55]">
          <p>© {new Date().getFullYear()} LADLLI SHOP ATELIER S.p.A. All rights reserved. Registered trademark.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#8e877c] cursor-pointer">Privacy Charter</span>
            <span className="hover:text-[#8e877c] cursor-pointer">Terms of Consignment</span>
            <span className="hover:text-[#8e877c] cursor-pointer">Security Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
