import type { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ServiceItem {
  slug: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  summary: string;
}

// Same real service list as apps/marketing/src/data/services.ts — kept in
// sync deliberately, not invented separately. The booking flow itself is
// still one generic "describe your problem" request regardless of which
// service is tapped (the API has no per-service intake yet), so every tile
// below routes to the same RequestVisit screen with a relevant starting hint.
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
