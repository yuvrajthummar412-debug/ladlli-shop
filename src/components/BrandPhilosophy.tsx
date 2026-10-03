import React from 'react';
import { Sparkles, Shield, Compass } from 'lucide-react';

interface BrandPhilosophyProps {
  onCategoryClick: (category: string) => void;
}

export const BrandPhilosophy: React.FC<BrandPhilosophyProps> = ({ onCategoryClick }) => {
  return (
    <section className="py-24 bg-[#0a0a0c] border-y border-[#1a1920] relative overflow-hidden">
      {/* Subtle gold ambient lighting bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[#f5cf68]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* Editorial Heading with Gold Half-Dot */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium flex items-center justify-center gap-2">
            <span className="gold-half-dot"></span>
            <span>The LADLLI Atelier Manifesto</span>
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl text-[#f5f2ec] font-normal tracking-tight">
            The Philosophy of Pure Ready-to-Wear
          </h2>
          <p className="text-sm sm:text-base text-[#9e968a] font-light leading-relaxed">
            We abolished the delays and friction of bespoke tailoring. By mastering anatomical drape and proportion, 
            every <strong className="text-gold font-medium">LADLLI SHOP</strong> piece fits as if hand-measured, ready to wear the moment the consignment arrives.
          </p>
        </div>

        {/* 3 Pillars Grid with Gold Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-[#121115] border border-[#201f27] hover:border-[#f5cf68]/45 rounded-sm space-y-4 relative group transition-all hover:shadow-[0_10px_25px_rgba(245,207,104,0.08)]">
            <div className="w-12 h-12 rounded-sm bg-[#1b1912] border border-[#f5cf68]/35 flex items-center justify-center text-[#f5cf68] shadow-[0_0_12px_rgba(245,207,104,0.18)]">
              <Sparkles size={20} />
            </div>
            <h3 className="font-serif-display text-xl text-[#f2efe9]">Zero Chemical Finishing</h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              Our Mongolian cashmere is un-dyed or naturally washed with alpine stream water in Biella, 
              preserving the lanolin and cloud-soft fiber core for decades of wear.
            </p>
          </div>

          <div className="p-8 bg-[#121115] border border-[#201f27] hover:border-[#f5cf68]/45 rounded-sm space-y-4 relative group transition-all hover:shadow-[0_10px_25px_rgba(245,207,104,0.08)]">
            <div className="w-12 h-12 rounded-sm bg-[#1b1912] border border-[#f5cf68]/35 flex items-center justify-center text-[#f5cf68] shadow-[0_0_12px_rgba(245,207,104,0.18)]">
              <Compass size={20} />
            </div>
            <h3 className="font-serif-display text-xl text-[#f2efe9]">Anatomical Ease</h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              Every armhole, shoulder slope, and trouser rise has been calibrated across 1,200 body scans 
              to provide freedom of motion without excess fabric bulk.
            </p>
          </div>

          <div className="p-8 bg-[#121115] border border-[#201f27] hover:border-[#f5cf68]/45 rounded-sm space-y-4 relative group transition-all hover:shadow-[0_10px_25px_rgba(245,207,104,0.08)]">
            <div className="w-12 h-12 rounded-sm bg-[#1b1912] border border-[#f5cf68]/35 flex items-center justify-center text-[#f5cf68] shadow-[0_0_12px_rgba(245,207,104,0.18)]">
              <Shield size={20} />
            </div>
            <h3 className="font-serif-display text-xl text-[#f2efe9]">Preshrunk Assurance</h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              All garments undergo double-cycle preshrinking before hand-finishing. 
              The size you select on our digital atelier is the permanent size you keep.
            </p>
          </div>

        </div>

        {/* Category Spotlight Row */}
        <div className="pt-8 border-t border-[#1c1b22] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Outerwear', sub: '420gsm Double-Faced Wool', cat: 'outerwear' },
            { label: 'Knitwear', sub: '7-Gauge Seamless Spun', cat: 'knitwear' },
            { label: 'Trousers', sub: 'Forward Pleated Fresco', cat: 'trousers' },
            { label: 'Essentials', sub: '300gsm Giza Long Staple', cat: 'essentials' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onCategoryClick(item.cat);
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 bg-[#121116] border border-[#1e1d24] hover:border-[#d4a373]/60 rounded-sm cursor-pointer transition-all hover:bg-[#18171e]"
            >
              <span className="font-serif-display text-lg text-[#f4f1ea] block">{item.label}</span>
              <span className="text-[11px] text-[#817b70] block mt-1">{item.sub}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
