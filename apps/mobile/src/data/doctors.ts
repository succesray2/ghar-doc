// MOCK DATA — for UI/UX demonstration only. No backend endpoint for doctor
// discovery/profiles/ratings exists yet (the real API only has one seeded
// doctor and no photo/bio/rating fields at all). Replace with a real API
// call once a doctor-directory endpoint exists. Every screen using this
// must stay swappable for a real fetch without a rewrite.
export interface MockDoctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  homeVisitFee: number;
  homeVisitAvailable: boolean;
  about: string;
  expertise: string[];
  gender: 'Male' | 'Female';
}

export const mockDoctors: MockDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Anjali Rao',
    qualification: 'MBBS, MD (General Medicine)',
    specialty: 'General Physician',
    experienceYears: 12,
    languages: ['English', 'Telugu', 'Hindi'],
    rating: 4.8,
    reviewCount: 214,
    consultationFee: 399,
    homeVisitFee: 699,
    homeVisitAvailable: true,
    about: 'Dr. Rao specializes in general medicine with a focus on preventive care and chronic condition management for the whole family.',
    expertise: ['Fever & infections', 'Diabetes management', 'Hypertension', 'Preventive checkups'],
    gender: 'Female',
  },
  {
    id: 'doc-2',
    name: 'Dr. Vikram Reddy',
    qualification: 'MBBS, DCH (Pediatrics)',
    specialty: 'Pediatrician',
    experienceYears: 9,
    languages: ['English', 'Telugu'],
    rating: 4.9,
    reviewCount: 176,
    consultationFee: 449,
    homeVisitFee: 749,
    homeVisitAvailable: true,
    about: 'Dr. Reddy focuses on child healthcare from newborns to teens, with a calm, family-friendly approach.',
    expertise: ['Newborn care', 'Vaccinations', 'Child illness', 'Growth monitoring'],
    gender: 'Male',
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Nair',
    qualification: 'MBBS, MD (Internal Medicine)',
    specialty: 'Internal Medicine',
    experienceYears: 15,
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.7,
    reviewCount: 301,
    consultationFee: 499,
    homeVisitFee: 799,
    homeVisitAvailable: true,
    about: 'Dr. Nair brings over a decade of experience treating complex, long-term conditions with a patient-first approach.',
    expertise: ['Elderly care', 'Post-surgical follow-up', 'Chronic pain', 'Thyroid disorders'],
    gender: 'Female',
  },
  {
    id: 'doc-4',
    name: 'Dr. Karthik Iyer',
    qualification: 'MBBS, MS (Orthopedics)',
    specialty: 'Orthopedic',
    experienceYears: 11,
    languages: ['English', 'Telugu', 'Tamil'],
    rating: 4.6,
    reviewCount: 128,
    consultationFee: 549,
    homeVisitFee: 0,
    homeVisitAvailable: false,
    about: 'Dr. Iyer treats musculoskeletal issues from sports injuries to age-related joint pain.',
    expertise: ['Joint pain', 'Fractures', 'Sports injuries', 'Post-injury rehab guidance'],
    gender: 'Male',
  },
];
