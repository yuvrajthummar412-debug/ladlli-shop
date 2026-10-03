import React from 'react';

interface GarmentVisualProps {
  category: string;
  name: string;
  colorHex?: string;
  className?: string;
  aspect?: '3:4' | '1:1' | '16:9';
  imageUrl?: string;
}

/**
 * Editorial Garment Visualizer
 * Supports real uploaded photos from client's phone or gallery,
 * with resilient luxury vector artwork fallback for zero-broken-image reliability.
 */
export const GarmentVisual: React.FC<GarmentVisualProps> = ({
  category,
  name,
  colorHex = '#1a191e',
  className = '',
  aspect = '3:4',
  imageUrl,
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const hasRealImage = Boolean(imageUrl && !imageUrl.includes('placeholder.jpg') && !imgError);

  const getAspectClass = () => {
    switch (aspect) {
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '3:4':
      default:
        return 'aspect-[3/4]';
    }
  };

  // Determine silhouette and accent tones based on category
  const renderGarmentArtwork = () => {
    switch (category) {
      case 'outerwear':
        return (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGradOuter" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a181b" />
                <stop offset="50%" stopColor="#121114" />
                <stop offset="100%" stopColor="#09080a" />
              </linearGradient>
              <linearGradient id="coatFabric" x1="0.2" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="60%" stopColor="#171518" />
                <stop offset="100%" stopColor="#0f0e10" />
              </linearGradient>
              <radialGradient id="spotLight" cx="60%" cy="25%" r="60%">
                <stop offset="0%" stopColor="rgba(240, 225, 205, 0.15)" />
                <stop offset="60%" stopColor="rgba(200, 180, 150, 0.03)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="lapelHighlight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
            </defs>

            {/* Background & Studio Lighting Beam */}
            <rect width="400" height="500" fill="url(#bgGradOuter)" />
            <rect width="400" height="500" fill="url(#spotLight)" />
            
            {/* Architectural Shadow diagonal */}
            <path d="M 0,0 L 280,0 L 400,500 L 0,500 Z" fill="rgba(0,0,0,0.22)" />

            {/* Outerwear Silhouette - Tailored Overcoat / Overshirt */}
            <g transform="translate(45, 60)">
              {/* Collar & Neck opening */}
              <path d="M 125,45 Q 155,75 185,45 L 205,65 Q 155,95 105,65 Z" fill="#0b0a0c" />

              {/* Main Body of Coat */}
              <path
                d="M 60,80 L 105,65 L 125,45 L 185,45 L 205,65 L 250,80 L 270,360 L 40,360 Z"
                fill="url(#coatFabric)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
              />

              {/* Left & Right Sleeves */}
              <path
                d="M 60,80 L 35,280 L 70,285 L 85,170 Z"
                fill="url(#coatFabric)"
                stroke="rgba(255,255,255,0.04)"
              />
              <path
                d="M 250,80 L 275,280 L 240,285 L 225,170 Z"
                fill="url(#coatFabric)"
                stroke="rgba(255,255,255,0.04)"
              />

              {/* Sharp Sartorial Lapels */}
              <path
                d="M 125,45 L 110,140 L 155,195 L 140,75 Z"
                fill="url(#lapelHighlight)"
              />
              <path
                d="M 185,45 L 200,140 L 155,195 L 170,75 Z"
                fill="#161418"
                stroke="rgba(255,255,255,0.08)"
              />

              {/* Center Placket & Horn Buttons */}
              <line x1="155" y1="195" x2="155" y2="360" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="155" cy="225" r="4.5" fill="#3a342d" stroke="#685f54" strokeWidth="1" />
              <circle cx="155" cy="275" r="4.5" fill="#3a342d" stroke="#685f54" strokeWidth="1" />
              <circle cx="155" cy="325" r="4.5" fill="#3a342d" stroke="#685f54" strokeWidth="1" />

              {/* Flap Pockets */}
              <rect x="75" y="245" width="45" height="6" rx="1" fill="#1e1b21" stroke="rgba(255,255,255,0.1)" />
              <rect x="190" y="245" width="45" height="6" rx="1" fill="#1e1b21" stroke="rgba(255,255,255,0.1)" />
            </g>

            {/* Subtle Brand Watermark Seal in bottom right */}
            <text x="360" y="475" textAnchor="end" fill="rgba(245, 207, 104, 0.4)" fontSize="10" letterSpacing="4" fontFamily="serif">LADLLI SHOP</text>
          </svg>
        );

      case 'knitwear':
        return (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgKnit" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#1e1b19" />
                <stop offset="60%" stopColor="#141211" />
                <stop offset="100%" stopColor="#0c0b0a" />
              </linearGradient>
              <linearGradient id="knitFabric" x1="0" y1="0" x2="1" y2="0.8">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="50%" stopColor="#2a2723" />
                <stop offset="100%" stopColor="#1a1816" />
              </linearGradient>
              <pattern id="knitRibPattern" width="6" height="12" patternUnits="userSpaceOnUse">
                <line x1="1" y1="0" x2="1" y2="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="400" height="500" fill="url(#bgKnit)" />
            {/* Warm Sunlight streak across garment */}
            <path d="M 120,0 L 400,240 L 400,500 L 220,500 Z" fill="rgba(238, 224, 203, 0.05)" />

            <g transform="translate(50, 70)">
              {/* Ribbed Polo Collar / Crew */}
              <path d="M 115,50 Q 150,75 185,50 L 195,65 Q 150,90 105,65 Z" fill="#2d2925" />
              <path d="M 105,65 L 140,110 L 150,85 L 115,50 Z" fill="#38332e" />
              <path d="M 195,65 L 160,110 L 150,85 L 185,50 Z" fill="#302b27" />

              {/* Main Knit Body */}
              <path
                d="M 65,85 L 105,65 L 195,65 L 235,85 L 245,340 L 55,340 Z"
                fill="url(#knitFabric)"
                stroke="rgba(255,255,255,0.08)"
              />
              <path
                d="M 65,85 L 105,65 L 195,65 L 235,85 L 245,340 L 55,340 Z"
                fill="url(#knitRibPattern)"
              />

              {/* Sleeves */}
              <path d="M 65,85 L 25,270 L 60,275 L 85,160 Z" fill="url(#knitFabric)" />
              <path d="M 235,85 L 275,270 L 240,275 L 215,160 Z" fill="url(#knitFabric)" />

              {/* Ribbed Hem and Cuffs */}
              <rect x="55" y="325" width="190" height="15" fill="#1b1816" stroke="rgba(255,255,255,0.09)" />
              <rect x="25" y="263" width="35" height="12" fill="#1b1816" stroke="rgba(255,255,255,0.09)" />
              <rect x="240" y="263" width="35" height="12" fill="#1b1816" stroke="rgba(255,255,255,0.09)" />

              {/* Polo Placket with mother-of-pearl buttons */}
              <rect x="144" y="85" width="12" height="60" fill="#24201c" rx="1" />
              <circle cx="150" cy="98" r="3" fill="#e8e0d4" />
              <circle cx="150" cy="118" r="3" fill="#e8e0d4" />
              <circle cx="150" cy="138" r="3" fill="#e8e0d4" />
            </g>

            <text x="360" y="475" textAnchor="end" fill="rgba(245, 207, 104, 0.4)" fontSize="10" letterSpacing="4" fontFamily="serif">LADLLI SHOP</text>
          </svg>
        );

      case 'shirts':
        return (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgShirt" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#18181c" />
                <stop offset="100%" stopColor="#0b0b0e" />
              </linearGradient>
              <linearGradient id="shirtFabric" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="70%" stopColor="#25242a" />
                <stop offset="100%" stopColor="#17161b" />
              </linearGradient>
            </defs>

            <rect width="400" height="500" fill="url(#bgShirt)" />
            <circle cx="280" cy="180" r="160" fill="rgba(242, 239, 233, 0.04)" />

            <g transform="translate(50, 65)">
              {/* Italian Cutaway Collar */}
              <path d="M 110,50 L 150,75 L 190,50 L 205,75 L 150,90 L 95,75 Z" fill="#2d2c34" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Torso */}
              <path
                d="M 65,85 L 105,65 L 195,65 L 235,85 L 242,345 Q 150,335 58,345 Z"
                fill="url(#shirtFabric)"
                stroke="rgba(255,255,255,0.07)"
              />

              {/* Sleeves */}
              <path d="M 65,85 L 30,270 L 65,275 L 85,160 Z" fill="url(#shirtFabric)" />
              <path d="M 235,85 L 270,270 L 235,275 L 215,160 Z" fill="url(#shirtFabric)" />

              {/* French Placket & Mother-of-Pearl buttons */}
              <rect x="145" y="88" width="10" height="250" fill="#212027" stroke="rgba(255,255,255,0.06)" />
              <circle cx="150" cy="115" r="3.2" fill="#eae4d8" />
              <circle cx="150" cy="155" r="3.2" fill="#eae4d8" />
              <circle cx="150" cy="195" r="3.2" fill="#eae4d8" />
              <circle cx="150" cy="235" r="3.2" fill="#eae4d8" />
              <circle cx="150" cy="275" r="3.2" fill="#eae4d8" />
              <circle cx="150" cy="315" r="3.2" fill="#eae4d8" />

              {/* Curved Sartorial Hem */}
              <path d="M 58,345 Q 150,332 242,345" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
            </g>

            <text x="360" y="475" textAnchor="end" fill="rgba(245, 207, 104, 0.4)" fontSize="10" letterSpacing="4" fontFamily="serif">LADLLI SHOP</text>
          </svg>
        );

      case 'trousers':
        return (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgTrouser" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a191c" />
                <stop offset="100%" stopColor="#0d0d0f" />
              </linearGradient>
              <linearGradient id="trouserFabric" x1="0.2" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="60%" stopColor="#252328" />
                <stop offset="100%" stopColor="#151417" />
              </linearGradient>
            </defs>

            <rect width="400" height="500" fill="url(#bgTrouser)" />
            {/* Chiaroscuro studio light gradient */}
            <path d="M 0,0 L 260,0 L 400,320 L 400,500 L 0,500 Z" fill="rgba(240, 225, 205, 0.04)" />

            <g transform="translate(60, 45)">
              {/* Extended Waistband with Side Adjusters */}
              <rect x="40" y="30" width="200" height="26" rx="2" fill="#2d2b31" stroke="rgba(255,255,255,0.1)" />
              <rect x="35" y="38" width="12" height="10" fill="#a49380" rx="1" />
              <rect x="233" y="38" width="12" height="10" fill="#a49380" rx="1" />

              {/* Trouser Legs with Double Pleats and Sharp Creases */}
              <path
                d="M 40,56 L 30,390 L 115,390 L 138,150 L 162,150 L 185,390 L 250,390 L 240,56 Z"
                fill="url(#trouserFabric)"
                stroke="rgba(255,255,255,0.08)"
              />

              {/* Sartorial Pleats & Center Crease Lines */}
              <line x1="82" y1="56" x2="72" y2="390" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <line x1="198" y1="56" x2="208" y2="390" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <line x1="98" y1="56" x2="94" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="182" y1="56" x2="186" y2="130" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

              {/* Turn-up Cuffs (4cm) */}
              <rect x="30" y="375" width="85" height="15" fill="#1e1c21" stroke="rgba(255,255,255,0.1)" />
              <rect x="185" y="375" width="65" height="15" fill="#1e1c21" stroke="rgba(255,255,255,0.1)" />
            </g>

            <text x="360" y="475" textAnchor="end" fill="rgba(245, 207, 104, 0.4)" fontSize="10" letterSpacing="4" fontFamily="serif">LADLLI SHOP</text>
          </svg>
        );

      default:
        // Elevated Essentials / Structured Tee
        return (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgEss" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#171618" />
                <stop offset="100%" stopColor="#0a0a0c" />
              </linearGradient>
              <linearGradient id="essFabric" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="100%" stopColor="#1c1a20" />
              </linearGradient>
            </defs>

            <rect width="400" height="500" fill="url(#bgEss)" />
            <g transform="translate(50, 75)">
              {/* Thick Ribbed Crewneck Collar */}
              <path d="M 105,45 Q 150,75 195,45 L 200,60 Q 150,90 100,60 Z" fill="#2d2b33" stroke="rgba(255,255,255,0.12)" />

              {/* Structured Tee Silhouette */}
              <path
                d="M 65,80 L 100,60 L 200,60 L 235,80 L 245,330 L 55,330 Z"
                fill="url(#essFabric)"
                stroke="rgba(255,255,255,0.08)"
              />
              <path d="M 65,80 L 20,180 L 65,190 L 80,130 Z" fill="url(#essFabric)" />
              <path d="M 235,80 L 280,180 L 235,190 L 220,130 Z" fill="url(#essFabric)" />

              {/* Blind Hem Stitch */}
              <line x1="55" y1="318" x2="245" y2="318" stroke="rgba(255,255,255,0.07)" strokeDasharray="3,3" />
            </g>

            <text x="360" y="475" textAnchor="end" fill="rgba(245, 207, 104, 0.4)" fontSize="10" letterSpacing="4" fontFamily="serif">LADLLI SHOP</text>
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#121114] ${getAspectClass()} ${className}`}>
      {hasRealImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        renderGarmentArtwork()
      )}
      {/* Editorial Grain Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
