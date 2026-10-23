import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'kiosk';
  showSubtitle?: boolean;
  theme?: 'light' | 'dark';
  iconOnly?: boolean;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  iconOnly = false
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 42 : size === 'lg' ? 56 : 76;
  const fontSize = size === 'sm' ? 19 : size === 'md' ? 24 : size === 'lg' ? 32 : 44;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? 10 : 14 }}>
      {/* 3D NEXORA Emblem with Sapphire & Cobalt Rim */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === 'sm' ? 10 : size === 'kiosk' ? 22 : 14,
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src="/nexora-logo.png"
          alt="NEXORA Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.08)',
            filter: 'contrast(1.05) brightness(1.02)'
          }}
        />
      </div>

      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', 'Manrope', sans-serif",
              fontWeight: 900,
              letterSpacing: '0.14em',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize,
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08))'
            }}
          >
            <span>NEX</span>
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              O
              <span
                style={{
                  position: 'absolute',
                  width: size === 'sm' ? 4 : size === 'md' ? 5 : 7,
                  height: size === 'sm' ? 4 : size === 'md' ? 5 : 7,
                  borderRadius: '50%',
                  background: '#2563EB',
                  boxShadow: '0 0 6px rgba(37, 99, 235, 0.6)'
                }}
              />
            </span>
            <span>RA</span>
          </div>

          {showSubtitle && (
            <span
              style={{
                fontSize: size === 'kiosk' ? 12 : 9,
                fontWeight: 800,
                letterSpacing: '0.24em',
                color: '#2563EB',
                marginTop: 4,
                textTransform: 'uppercase'
              }}
            >
              INTELLIGENT CAMPUS OS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Aliased export for backwards compatibility
export const NoirLogo = NexoraLogo;
export default NexoraLogo;
