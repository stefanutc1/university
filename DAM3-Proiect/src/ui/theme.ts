export const theme = {
  colors: {
    // Deep Cosmic Glass Palette
    background: '#07090E',
    backgroundSecondary: '#0B0F19',

    // Frosted Glass Surfaces
    surface: 'rgba(16, 22, 34, 0.78)',
    surfaceTranslucent: 'rgba(20, 28, 44, 0.55)',
    surfaceCard: 'rgba(18, 26, 42, 0.85)',
    surfaceGlass: 'rgba(25, 36, 56, 0.65)',
    surfaceGlassActive: 'rgba(0, 242, 254, 0.12)',

    // Glass Borders
    surfaceBorder: 'rgba(255, 255, 255, 0.09)',
    surfaceBorderGlass: 'rgba(0, 242, 254, 0.35)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',

    // Neon Accents
    accent: '#00F2FE', // Electric Cyan
    accentGlow: 'rgba(0, 242, 254, 0.45)',
    accentSecondary: '#4FACFE', // Neon Azure
    accentDark: '#0D3B54',

    // Status Colors
    sosEmergency: '#FF2A55',
    sosGlow: 'rgba(255, 42, 85, 0.45)',
    sosBackground: '#2E0E15',
    success: '#00E676',
    successGlow: 'rgba(0, 230, 118, 0.35)',
    warning: '#FFB300',

    // Text Hierarchy
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textPlaceholder: '#475569',
  },
  typography: {
    fontFamilySans: 'System',
    fontFamilyMono: 'Courier New',
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 22,
      display: 28,
    },
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
      black: '900' as const,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.8,
      caps: 1.5,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    full: 9999,
  },
  shadows: {
    glass: {
      shadowColor: '#00F2FE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 8,
    },
    glowCyan: {
      shadowColor: '#00F2FE',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 10,
    },
    glowSos: {
      shadowColor: '#FF2A55',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
  },
};
