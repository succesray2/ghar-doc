/**
 * PLACEHOLDER CONTENT.
 *
 * Every value below is a stand-in, not real Ghar Doc information — city,
 * areas, phone/email, founder bio, testimonials, pricing, and stats are all
 * invented so the site has something believable to show. This file is the
 * single place to edit before launch; nothing else in the app hardcodes
 * this kind of content.
 *
 * A separate rule applies throughout this file regardless of the above:
 * nothing here claims an in-app feature that isn't actually built yet
 * (e.g. no "digital prescriptions" or "shared vitals" — those are Phase 2
 * roadmap, not live). Business-level promises (coordination, follow-up)
 * are fine; specific technical claims are not, until they're true.
 */

const city = 'your city';

export const siteContent = {
  city,

  areas: [
    'Downtown',
    'Riverside',
    'Lakeview',
    'Greenfield',
    'Hillcrest',
    'Old Town',
    'Northgate',
    'Southpark',
    'Eastside',
    'Westbrook',
    'Maple Heights',
    'Sunnyvale',
  ],

  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY ?? '+91 90000 00000',
  phoneHref: (import.meta.env.VITE_CONTACT_PHONE ?? '+919000000000').replace(/\s+/g, ''),
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'care@ghardoc.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '910000000000',
  officeHours: 'Mon–Sun, 7:00 AM – 10:00 PM',

  founder: {
    name: 'Dr. [Founder Name]',
    credentials: 'MBBS, MD — Founder & Chief Medical Officer',
    bio: "Placeholder bio. Replace with the founding doctor's real background: years in practice, prior leadership roles, and why they started Ghar Doc.",
  },

  howItWorks: [
    { step: '1', title: 'Choose your care', description: 'Pick a doctor visit, nursing, diagnostics, physiotherapy, or elderly care.' },
    { step: '2', title: 'Pick a time & place', description: 'Tell us when and where — we match you with an available, verified doctor nearby.' },
    { step: '3', title: 'Receive verified care', description: 'A background-checked professional arrives at your door, on time.' },
    { step: '4', title: 'Track it in your account', description: 'Every visit and its status is right there, whenever you need to check.' },
  ],

  trustPoints: [
    { icon: 'ShieldCheck', title: 'Verified doctors', description: 'Every doctor is MBBS-qualified and approved by our team before they can be assigned a visit.' },
    { icon: 'BadgeCheck', title: 'Licensed professionals', description: 'Nurses and physiotherapists are credential-checked before joining Ghar Doc.' },
    { icon: 'CalendarClock', title: 'Book in minutes', description: 'Request a visit and see its status update in real time, from request to completion.' },
    { icon: 'History', title: 'A full visit history', description: 'Every visit is timestamped and kept in your account — nothing gets lost between appointments.' },
    { icon: 'MapPin', title: 'Care that comes to you', description: 'No commute, no waiting room — the visit happens at the address you choose.' },
    { icon: 'Lock', title: 'Your data, protected', description: "Your account and visit details are yours — accessible only to you and your care team." },
  ],

  doctorVetting: [
    { icon: 'GraduationCap', title: 'MBBS or higher', description: "Every doctor's medical degree is verified before they're allowed to join." },
    { icon: 'IdCard', title: 'License checked', description: 'Medical registration is confirmed before anyone can accept a visit.' },
    { icon: 'CheckCircle2', title: 'Approved before assignment', description: "New doctors can't be assigned a single visit until our team marks them approved." },
    { icon: 'ClipboardList', title: 'Every visit accountable', description: 'Each step of a visit is logged, so care stays traceable from request to completion.' },
  ],

  familyAudiences: [
    { icon: 'Baby', label: 'Parents & children', description: "Quick, careful attention for a sick child — without a waiting room." },
    { icon: 'Briefcase', label: 'Working professionals', description: 'Book around your calendar, not a clinic queue.' },
    { icon: 'HeartHandshake', label: 'Elderly parents', description: 'Regular checkups at home, with family kept informed.' },
    { icon: 'Activity', label: 'Ongoing care', description: 'Ongoing conditions, followed consistently, visit after visit.' },
  ],

  appPreview: [
    {
      icon: 'LayoutDashboard',
      title: 'Your visits, at a glance',
      description: 'See every request and its live status — requested, assigned, en route, in progress, completed.',
    },
    {
      icon: 'CalendarPlus',
      title: 'Book in a few taps',
      description: 'Choose a service, share your address, and request a visit in under a minute.',
    },
    {
      icon: 'FolderClock',
      title: 'A running care history',
      description: "Every past visit stays in your account — a growing record of your family's care.",
    },
  ],

  testimonials: [
    {
      name: 'Placeholder Patient',
      area: 'Downtown',
      quote: 'Placeholder testimonial — replace with a real patient quote once you have one.',
    },
    {
      name: 'Placeholder Patient',
      area: 'Lakeview',
      quote: 'Placeholder testimonial — replace with a real patient quote once you have one.',
    },
    {
      name: 'Placeholder Patient',
      area: 'Hillcrest',
      quote: 'Placeholder testimonial — replace with a real patient quote once you have one.',
    },
  ],

  faqs: [
    {
      question: 'What is Ghar Doc?',
      answer:
        'Ghar Doc arranges doctor home visits — you tell us what you need, an admin assigns a verified doctor, and you track the visit from request to completion in your account.',
    },
    {
      question: 'How do I book a doctor home visit?',
      answer:
        'Create an account, describe the reason for the visit and your address, and submit the request. An admin reviews it and assigns an approved doctor to you.',
    },
    {
      question: 'Which areas do you currently serve?',
      answer: `We currently serve select neighborhoods in ${city}. If your area isn't listed, contact us and we'll let you know if we can reach you.`,
    },
    {
      question: 'Are your doctors verified?',
      answer: 'Yes. Every doctor is MBBS-qualified and approved by our team before they can be assigned a single visit.',
    },
    {
      question: 'Can I book healthcare for a family member?',
      answer:
        "Not yet — today, each account manages visits for the account holder. Booking for family members is something we're working toward.",
    },
    {
      question: 'Can I book a diagnostic test or home sample collection?',
      answer:
        "Diagnostics and home sample collection aren't available yet — we're building this out and will share details once it's ready.",
    },
    {
      question: 'Can I cancel a booking? Can I reschedule?',
      answer:
        'You can cancel a visit while it\'s still Requested or Assigned, directly from your account. Rescheduling isn\'t a separate feature yet — cancel and submit a new request if your timing changes.',
    },
    {
      question: 'How do refunds work?',
      answer: "Ghar Doc doesn't process online payments yet, so there's nothing to refund through the platform at this stage.",
    },
    {
      question: 'Can I see my past visits?',
      answer: 'Yes — every visit you request stays in your account with its full status history, so you can look back any time.',
    },
    {
      question: 'Is Ghar Doc an emergency medical service?',
      answer:
        "No. Ghar Doc is not a substitute for emergency care. For a medical emergency, call 108 (India's national ambulance service) or go to the nearest emergency room.",
    },
    {
      question: 'Is there a mobile app?',
      answer: 'A Ghar Doc app is in progress and not yet publicly available. For now, book and manage visits through this website.',
    },
  ],
};
