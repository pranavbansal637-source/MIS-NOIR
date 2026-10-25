import React from 'react';

interface VascenovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'kiosk';
  showSubtitle?: boolean;
  theme?: 'light' | 'dark';
  iconOnly?: boolean;
  useImageBanner?: boolean;
}

export const VascenovaLogo: React.FC<VascenovaLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  theme,
  iconOnly = false,
  useImageBanner = false
}) => {
  const iconSize = size === 'sm' ? 34 : size === 'md' ? 44 : size === 'lg' ? 60 : 80;
  const fontSize = size === 'sm' ? 18 : size === 'md' ? 24 : size === 'lg' ? 32 : 46;

  // If banner mode requested for hero screens
  if (useImageBanner) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <img
          src="./vascenova-logo.png"
          alt="VASCENOVA — Beyond Biometrics. Beyond Boundaries."
          style={{
            maxWidth: size === 'lg' ? 380 : size === 'kiosk' ? 520 : 260,
            width: '100%',
            height: 'auto',
            borderRadius: 14,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
          }}
        />
      </div>
    );
  }

  // Dual horizontal bars for the stylized 'E'
  const eWidth = Math.round(fontSize * 0.52);
  const eHeight = Math.max(2, Math.round(fontSize * 0.11));
  const eGap = Math.max(2.5, Math.round(fontSize * 0.12));

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? 10 : 14 }}>
      {/* Biometric Palm Emblem with Cyan Orbit Glow */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === 'sm' ? 10 : size === 'kiosk' ? 22 : 14,
          background: '#0B2559',
          border: '1.5px solid rgba(0, 229, 255, 0.5)',
          boxShadow: '0 2px 10px rgba(11, 37, 89, 0.4), 0 0 14px rgba(0, 229, 255, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src="./vascenova-icon.png"
          alt="VASCENOVA Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Stylized Wordmark: V Λ S C ═ N O V Λ */}
          <div
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 900,
              letterSpacing: '0.14em',
              fontSize,
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: Math.max(1, Math.round(fontSize * 0.06)),
              color: theme === 'dark' ? '#FFFFFF' : 'var(--text-primary)',
              userSelect: 'none',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))'
            }}
          >
            <span>V</span>
            <span>Λ</span>
            <span>S</span>
            <span>C</span>
            <span
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: eGap,
                height: fontSize * 0.76,
                padding: '0 1px'
              }}
            >
              <span
                style={{
                  width: eWidth,
                  height: eHeight,
                  backgroundColor: '#00E5FF',
                  borderRadius: 1,
                  boxShadow: '0 0 8px rgba(0, 229, 255, 0.7)'
                }}
              />
              <span
                style={{
                  width: eWidth,
                  height: eHeight,
                  backgroundColor: '#00E5FF',
                  borderRadius: 1,
                  boxShadow: '0 0 8px rgba(0, 229, 255, 0.7)'
                }}
              />
            </span>
            <span>N</span>
            <span>O</span>
            <span>V</span>
            <span>Λ</span>
          </div>

          {/* Tagline */}
          {showSubtitle && (
            <span
              style={{
                fontSize: size === 'kiosk' ? 12 : size === 'lg' ? 11 : 8.5,
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: '#00E5FF',
                marginTop: 4,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '0 0 8px rgba(0, 229, 255, 0.35)'
              }}
            >
              Beyond Biometrics. Beyond Boundaries.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Aliased exports for universal backwards compatibility
export const NexoraLogo = VascenovaLogo;
export const NoirLogo = VascenovaLogo;
export default VascenovaLogo;
