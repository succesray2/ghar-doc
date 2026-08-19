import type { MaterialCommunityIcons } from '@expo/vector-icons';

export interface TrustPoint {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}

// Same real trust points as apps/marketing/src/data/content.ts's trustPoints
// — kept in sync deliberately. Every claim here is actually true of the
// built product (verified-doctor approval gate, real visit-status timeline,
// per-visit address, account-scoped data) — not marketing puffery.
export const trustPoints: TrustPoint[] = [
  {
    icon: 'shield-check',
    title: 'Verified doctors',
    description: 'Every doctor is MBBS-qualified and approved by our team before they can be assigned a visit.',
  },
  {
    icon: 'calendar-clock',
    title: 'Book in minutes',
    description: 'Request a visit and see its status update in real time, from request to completion.',
  },
  {
    icon: 'history',
    title: 'A full visit history',
    description: 'Every visit is timestamped and kept in your account — nothing gets lost between appointments.',
  },
  {
    icon: 'map-marker',
    title: 'Care that comes to you',
    description: 'No commute, no waiting room — the visit happens at the address you choose.',
  },
];
