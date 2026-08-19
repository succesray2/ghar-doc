export interface Service {
  slug: string;
  title: string;
  icon: 'Stethoscope' | 'Syringe' | 'FlaskConical' | 'Activity' | 'HeartHandshake' | 'Users';
  summary: string;
  details: string[];
}

export const services: Service[] = [
  {
    slug: 'doctor-visits',
    title: 'Doctor Home Visits',
    icon: 'Stethoscope',
    summary: 'General physician consultations for fever, infections, and routine checkups — without leaving home.',
    details: [
      'Verified MBBS doctors, approved before assignment',
      'Request anytime — scheduled or as-needed',
      'Every visit logged to your account',
    ],
  },
  {
    slug: 'home-nursing',
    title: 'Home Nursing',
    icon: 'Syringe',
    summary: 'Trained nurses for injections, IV drips, wound care, and post-hospital support at home.',
    details: ['Trained, licensed nursing staff', 'Post-surgery and post-hospitalization care', 'Coordinated with your treating doctor'],
  },
  {
    slug: 'diagnostics',
    title: 'Diagnostics at Home',
    icon: 'FlaskConical',
    summary: 'Blood tests, ECGs, and full-body checkups without a trip to a lab.',
    details: ['Sample collection at your doorstep', 'Accredited lab partners', 'Reports shared with you promptly'],
  },
  {
    slug: 'physiotherapy',
    title: 'Physiotherapy at Home',
    icon: 'Activity',
    summary: 'Post-injury recovery and rehabilitation with a plan built around you.',
    details: ['Certified physiotherapists', 'Personalized recovery plans', 'Consistent care, visit after visit'],
  },
  {
    slug: 'elderly-care',
    title: 'Elderly Healthcare',
    icon: 'HeartHandshake',
    summary: 'Dedicated, patient care for seniors — with family kept in the loop.',
    details: ['Recurring wellness checkups', 'Chronic-condition-aware care', 'Coordinated with family caregivers'],
  },
  {
    slug: 'family-plans',
    title: 'Family Healthcare Plans',
    icon: 'Users',
    summary: 'One relationship covering care for every generation under one roof.',
    details: ['Priority booking for every family member', 'One point of contact for the whole family', 'Predictable, plan-based pricing'],
  },
];
