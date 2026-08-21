// Mirrors apps/marketing/tailwind.config.ts's premium redesign tokens exactly,
// so the app and the marketing site share one brand system.
export const colors = {
  bg: '#F8FAFC',
  bgSoft: '#F1F5F7',

  navy900: '#0B2340',
  navy700: '#16375E',
  navy600: '#1D4A79',

  teal600: '#3F8E88',
  teal500: '#56A39D',
  teal100: '#E3F1EF',

  sage600: '#5F9F6B',
  sage100: '#E8F3E9',

  ink900: '#14202B',
  ink600: '#435160',
  ink400: '#7C8896',
  line: '#E4E9EE',

  card: '#ffffff',
  danger: '#dc2626',
  dangerBg: '#fee2e2',

  // Back-compat aliases used across existing components — same colors, new names.
  brand50: '#E3F1EF',
  brand100: '#E3F1EF',
  brand500: '#3F8E88',
  brand600: '#3F8E88',
  brand700: '#16375E',
  gharBlue: '#16375E',
  text: '#14202B',
  textMuted: '#7C8896',
  border: '#E4E9EE',
  warning: '#b45309',
  warningBg: '#fef3c7',
} as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: '#fef3c7', text: '#b45309', label: 'Requested' },
  ASSIGNED: { bg: '#dbeafe', text: colors.navy700, label: 'Assigned' },
  PROVIDER_ACCEPTED: { bg: '#dbeafe', text: colors.navy700, label: 'Provider accepted' },
  PROVIDER_DECLINED: { bg: '#fee2e2', text: '#b91c1c', label: 'Provider declined' },
  EN_ROUTE: { bg: '#e0e7ff', text: '#4338ca', label: 'En route' },
  ARRIVED: { bg: '#e0e7ff', text: '#4338ca', label: 'Arrived' },
  IN_PROGRESS: { bg: '#ede9fe', text: '#6d28d9', label: 'In progress' },
  COMPLETED: { bg: colors.sage100, text: colors.sage600, label: 'Completed' },
  CANCELLED: { bg: '#f1f5f9', text: '#475569', label: 'Cancelled' },
  NO_PROVIDER_AVAILABLE: { bg: '#fee2e2', text: '#b91c1c', label: 'No provider available' },
};
