import type { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ServiceItem {
  slug: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  summary: string;
}

// Same real service list as apps/marketing/src/data/services.ts — kept in
// sync deliberately, not invented separately. Nursing and Physiotherapy now
// have their own real, structured booking flows (RequestNursing/
// RequestPhysiotherapy) with a real safety-net check and admin assignment
// to an actual verified nurse/physiotherapist account — not a cosmetic
// text-hint into the generic doctor wizard anymore. Doctor visits, Home
// Records, and the other tiles still route to their existing real screens.
export const services: ServiceItem[] = [
  {
    slug: 'doctor-visits',
    title: 'Doctor Home Visits',
    icon: 'stethoscope',
    summary: 'General physician consultations for fever, infections, and routine checkups.',
  },
  {
    slug: 'home-nursing',
    title: 'Home Nursing',
    icon: 'needle',
    summary: 'Trained nurses for injections, IV drips, and wound care at home.',
  },
  {
    slug: 'diagnostics',
    title: 'Diagnostics at Home',
    icon: 'flask-outline',
    summary: 'Blood tests, ECGs, and full-body checkups without a trip to a lab.',
  },
  {
    slug: 'physiotherapy',
    title: 'Physiotherapy',
    icon: 'yoga',
    summary: 'Post-injury recovery and rehabilitation with a plan built around you.',
  },
  {
    slug: 'elderly-care',
    title: 'Elderly Healthcare',
    icon: 'hand-heart',
    summary: 'Dedicated, patient care for seniors — with family kept in the loop.',
  },
  {
    slug: 'family-plans',
    title: 'Family Healthcare',
    icon: 'account-group',
    summary: 'One relationship covering care for every generation under one roof.',
  },
];
