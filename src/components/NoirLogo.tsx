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
      {/* 3D NEXORA Emblem with Solar Amber & Titanium Rim */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === 'sm' ? 10 : size === 'kiosk' ? 22 : 14,
          background: 'linear-gradient(135deg, rgba(20, 24, 34, 0.9) 0%, rgba(8, 10, 16, 0.95) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 18px rgba(245, 158, 11, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
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
            filter: 'contrast(1.1) brightness(1.05)'
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
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 45%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize,
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              filter: 'drop-shadow(0 2px 12px rgba(245, 158, 11, 0.3))'
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
                  background: '#F59E0B',
                  boxShadow: '0 0 6px #F59E0B'
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
                color: '#F59E0B',
                marginTop: 4,
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(245, 158, 11, 0.45)'
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
