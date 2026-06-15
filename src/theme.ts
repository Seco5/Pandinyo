export const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  primary: '#111111',
  secondary: '#3A3A3A',
  accent: '#FFC83D',
  success: '#22C55E',
  danger: '#EF4444',
  border: '#EAEAEA',
  muted: '#9A9A9A',
  onAccent: '#111111',
  onPrimary: '#FFFFFF',
};

export const radius = {
  lg: 28,
  md: 16,
  sm: 10,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const type = {
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary },
  subtitle: { fontFamily: fonts.semibold, fontSize: 18, color: colors.primary },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.secondary },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  small: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
} as const;
