// Mirrors apps/web/tailwind.config.ts's `brand` scale, plus the Tailwind
// blue-700 used for the "Ghar" half of the wordmark (AppShell/Login/Signup).
export const colors = {
  brand50: '#f0f9f6',
  brand100: '#dbf0e8',
  brand500: '#0f9d68',
  brand600: '#0c7f54',
  brand700: '#0a6644',
  gharBlue: '#1d4ed8',

  bg: '#f8faf9',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  danger: '#dc2626',
  dangerBg: '#fee2e2',
  warning: '#b45309',
  warningBg: '#fef3c7',
} as const;

export const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: '#fef3c7', text: '#b45309', label: 'Requested' },
  ASSIGNED: { bg: '#dbeafe', text: '#1d4ed8', label: 'Assigned' },
  EN_ROUTE: { bg: '#e0e7ff', text: '#4338ca', label: 'En route' },
  IN_PROGRESS: { bg: '#ede9fe', text: '#6d28d9', label: 'In progress' },
  COMPLETED: { bg: colors.brand100, text: colors.brand700, label: 'Completed' },
  CANCELLED: { bg: '#f1f5f9', text: '#475569', label: 'Cancelled' },
};
