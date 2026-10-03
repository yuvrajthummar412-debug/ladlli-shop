import React from 'react';
import { Truck, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onCategoryClick: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onCategoryClick }) => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#0a0a0c] pt-8 pb-16">
      {/* Background Cinematic Atmosphere with Gold Bloom Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Luminous gold aura bloom */}
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-[#f5cf68]/10 rounded-full blur-[150px]" />
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[#d4a329]/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#221f2b]/40 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grain opacity-30" />
      </div>

      {/* Main Campaign Canvas */}
      <div className="relative max-w-7xl mx-auto px-6 w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: High-contrast Editorial Typography */}
          <div className="lg:col-span-7 space-y-8 z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-medium text-gold">
                <span className="gold-half-dot"></span>
                <span>LADLLI SHOP · AUTUMN / WINTER 2026</span>
              </div>

              <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#f7f4ed] leading-[1.08] text-balance">
                Timeless <br />
                <span className="italic font-light text-gold-gradient">by Nature.</span>
              </h1>
            </div>

            <p className="text-[#a8a195] text-base sm:text-lg max-w-xl font-light leading-relaxed">
              &ldquo;Luxury isn&rsquo;t loud, it&rsquo;s in the details.&rdquo; Ready-made menswear crafted from 
              uncompromising natural fibers, precision drape, and unhurried artisanal discipline.
            </p>

            {/* Editorial CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="group px-7 py-3.5 bg-gold-gradient hover:bg-gold-gradient-hover text-[#0a0a0c] text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-all duration-300 flex items-center gap-2.5 shadow-[0_0_24px_rgba(245,207,104,0.35)] hover:translate-y-[-1px] border border-[#fff2be]/40"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onCategoryClick('outerwear')}
                className="px-7 py-3.5 border border-[#f5cf68]/40 hover:border-[#f5cf68] text-[#f2efe9] hover:text-[#fae28e] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all duration-300 bg-[#141318]/60 backdrop-blur-sm"
              >
                View Outerwear
              </button>
            </div>

            {/* Editorial Metadata with gold accents */}
            <div className="pt-6 border-t border-[#1e1d23] flex items-center gap-6 text-xs text-[#7d776e]">
              <div>
                <span className="text-[#f2efe9] font-medium flex items-center gap-1.5">
                  <span className="gold-dot"></span>
                  Standard Sizing
                </span>
                <span>Ready-to-wear S to XXL</span>
              </div>
              <div className="w-[1px] h-6 bg-[#25242b]" />
              <div>
                <span className="text-[#f2efe9] font-medium flex items-center gap-1.5">
                  <span className="gold-dot"></span>
                  Biella & Biarritz
                </span>
                <span>Certified Mill Fabrics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature Silhouette */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame Border with gold glow */}
              <div className="absolute -inset-3 rounded-sm border border-[#f5cf68]/20 pointer-events-none" />
              
              <div className="relative rounded-sm overflow-hidden bg-[#16151a] shadow-2xl border border-[#272630]">
                {/* Visual Artwork Composition */}
                <div className="aspect-[4/5] relative">
                  <svg viewBox="0 0 500 625" className="w-full h-full object-cover" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#252220" />
                        <stop offset="40%" stopColor="#151417" />
                        <stop offset="100%" stopColor="#0a0a0c" />
                      </linearGradient>
                      <radialGradient id="heroSunlight" cx="70%" cy="20%" r="70%">
                        <stop offset="0%" stopColor="rgba(245, 207, 104, 0.28)" />
                        <stop offset="60%" stopColor="rgba(210, 165, 50, 0.06)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    
                    <rect width="500" height="625" fill="url(#heroGradient)" />
                    <rect width="500" height="625" fill="url(#heroSunlight)" />
                    
                    {/* Architectural Chiaroscuro Light Beam */}
                    <path d="M 0,0 L 320,0 L 500,500 L 220,625 Z" fill="rgba(245, 207, 104, 0.08)" />
                    
                    {/* Editorial Silhouette of the Overcoat Model */}
                    <g transform="translate(60, 70)">
                      {/* Sculpted Head & Beard Outline */}
                      <path d="M 190,80 Q 205,50 170,45 Q 135,50 150,80 Q 140,110 170,120 Q 200,110 190,80 Z" fill="#29262e" />
                      <path d="M 148,95 Q 170,140 192,95 Z" fill="#4a4440" />

                      {/* Tailored Coat drape */}
                      <path
                        d="M 90,135 L 140,115 L 200,115 L 250,135 L 280,480 L 60,480 Z"
                        fill="#121115"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1.5"
                      />

                      {/* Coat Lapels with Warm Specular Highlight */}
                      <path d="M 140,115 L 125,230 L 170,300 L 155,160 Z" fill="#222027" stroke="rgba(245, 207, 104, 0.25)" />
                      <path d="M 200,115 L 215,230 L 170,300 L 185,160 Z" fill="#18171d" stroke="rgba(255,255,255,0.06)" />

                      {/* Silk Inner Tie & Collar */}
                      <path d="M 160,145 L 180,145 L 175,250 L 165,250 Z" fill="#42341b" />

                      {/* Sleeves */}
                      <path d="M 90,135 L 50,380 L 95,385 L 120,240 Z" fill="#121115" />
                      <path d="M 250,135 L 290,380 L 245,385 L 220,240 Z" fill="#121115" />
                    </g>
                    
                    {/* Overlaid Editorial Text in bottom */}
                    <text x="35" y="580" fill="#f5cf68" fontSize="30" fontFamily="serif" fontWeight="400" letterSpacing="3">LADLLI SHOP</text>
                    <text x="35" y="602" fill="#d4af37" fontSize="10" letterSpacing="4" fontFamily="sans-serif">SARTORIAL LUXURY NO. 04</text>
                  </svg>

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Glassmorphic Trust Badges Bar with Gold Accents */}
      <div className="relative max-w-7xl mx-auto px-6 w-full z-20">
        <div className="glass-pill rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center border border-[#f5cf68]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(245,207,104,0.1)]">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#1c1a13] flex items-center justify-center text-[#f5cf68] shrink-0 border border-[#f5cf68]/35 shadow-[0_0_12px_rgba(245,207,104,0.2)]">
              <Truck size={19} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#f2efe9] flex items-center gap-1.5">
                <span className="gold-dot"></span>
                <span>Free Express Air</span>
              </h4>
              <p className="text-[11px] text-[#a69e90] mt-0.5">On all orders above ₹4,999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#1c1a13] flex items-center justify-center text-[#f5cf68] shrink-0 border border-[#f5cf68]/35 shadow-[0_0_12px_rgba(245,207,104,0.2)]">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#f2efe9] flex items-center gap-1.5">
                <span className="gold-dot"></span>
                <span>100% Encrypted</span>
              </h4>
              <p className="text-[11px] text-[#a69e90] mt-0.5">UPI, Cards & Encrypted COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#1c1a13] flex items-center justify-center text-[#f5cf68] shrink-0 border border-[#f5cf68]/35 shadow-[0_0_12px_rgba(245,207,104,0.2)]">
              <Award size={19} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#f2efe9] flex items-center gap-1.5">
                <span className="gold-dot"></span>
                <span>Gold Standard Fit</span>
              </h4>
              <p className="text-[11px] text-[#a69e90] mt-0.5">Pre-washed, zero tailoring</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#1c1a13] flex items-center justify-center text-[#f5cf68] shrink-0 border border-[#f5cf68]/35 shadow-[0_0_12px_rgba(245,207,104,0.2)]">
              <Clock size={19} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#f2efe9] flex items-center gap-1.5">
                <span className="gold-dot"></span>
                <span>24/7 Concierge</span>
              </h4>
              <p className="text-[11px] text-[#a69e90] mt-0.5">Private sizing advisory</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
