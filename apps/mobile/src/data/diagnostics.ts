import type { MaterialCommunityIcons } from '@expo/vector-icons';

// MOCK DATA — the real diagnostic catalogue hasn't been provided yet (per
// the user's own note: "I will later provide the list of diagnostic tests,
// prices, descriptions"). This file is intentionally the ONE place all of
// it lives, in a shape a real API response could drop into directly, so
// wiring up the real catalogue later means swapping this file's source,
// not rewriting the screens that consume it.

export interface DiagnosticCategory {
  slug: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const diagnosticCategories: DiagnosticCategory[] = [
  { slug: 'blood', title: 'Blood Tests', icon: 'water-outline' },
  { slug: 'urine', title: 'Urine Tests', icon: 'flask-outline' },
  { slug: 'hormone', title: 'Hormone Tests', icon: 'molecule' },
  { slug: 'vitamin', title: 'Vitamin & Nutrition', icon: 'food-apple-outline' },
  { slug: 'imaging', title: 'Imaging', icon: 'radiology-box-outline' },
  { slug: 'cardiac', title: 'Cardiac Tests', icon: 'heart-pulse' },
  { slug: 'women', title: "Women's Health", icon: 'human-female' },
  { slug: 'men', title: "Men's Health", icon: 'human-male' },
  { slug: 'child', title: 'Child Health', icon: 'baby-face-outline' },
  { slug: 'preventive', title: 'Preventive Packages', icon: 'shield-check-outline' },
];

export interface DiagnosticTest {
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  discountedPrice?: number;
  sampleType: string;
  fastingRequired: boolean;
  reportTime: string;
  whatIsIt: string;
  whyDone: string;
  detects: string[];
  whenRecommended: string;
  beforeTest: string;
  keywords: string[];
}

export const diagnosticTests: DiagnosticTest[] = [
  {
    slug: 'cbc',
    name: 'Complete Blood Count (CBC)',
    categorySlug: 'blood',
    price: 399,
    discountedPrice: 299,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: 'Usually available within 24 hours.',
    whatIsIt: 'A CBC measures the different cells in your blood — red cells, white cells, and platelets.',
    whyDone: 'It gives a broad snapshot of your overall health and can flag anemia, infection, or clotting issues.',
    detects: ['Anemia', 'Infection', 'Inflammation', 'Clotting problems'],
    whenRecommended: 'Often ordered as part of a routine checkup, or when you have unexplained fatigue, fever, or bruising.',
    beforeTest: 'No fasting required. No special preparation needed.',
    keywords: ['cbc', 'blood count', 'anemia', 'infection'],
  },
  {
    slug: 'hba1c',
    name: 'HbA1c (Average Blood Sugar)',
    categorySlug: 'blood',
    price: 599,
    discountedPrice: 449,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: 'Usually available within 24 hours.',
    whatIsIt: 'HbA1c shows your average blood sugar level over the past 2-3 months.',
    whyDone: 'It helps diagnose and monitor diabetes more reliably than a single sugar reading.',
    detects: ['Diabetes', 'Pre-diabetes', 'Blood sugar control over time'],
    whenRecommended: 'Recommended for anyone with diabetes risk factors, or to track existing diabetes management.',
    beforeTest: 'No fasting required.',
    keywords: ['diabetes', 'hba1c', 'sugar', 'glucose', 'a1c'],
  },
  {
    slug: 'fasting-sugar',
    name: 'Fasting Blood Sugar',
    categorySlug: 'blood',
    price: 149,
    sampleType: 'Blood',
    fastingRequired: true,
    reportTime: 'Same day.',
    whatIsIt: 'Measures your blood sugar level after an overnight fast.',
    whyDone: 'A quick way to screen for or monitor diabetes.',
    detects: ['Diabetes', 'Pre-diabetes'],
    whenRecommended: 'Part of routine health checkups, especially with a family history of diabetes.',
    beforeTest: 'Fast for 8-10 hours before the test (water is fine).',
    keywords: ['diabetes', 'sugar', 'glucose', 'fasting'],
  },
  {
    slug: 'lipid-profile',
    name: 'Lipid Profile',
    categorySlug: 'blood',
    price: 599,
    discountedPrice: 499,
    sampleType: 'Blood',
    fastingRequired: true,
    reportTime: 'Usually available within 24 hours.',
    whatIsIt: 'Measures cholesterol and triglyceride levels in your blood.',
    whyDone: 'Helps assess your risk of heart disease.',
    detects: ['High cholesterol', 'Heart disease risk'],
    whenRecommended: 'Recommended annually for adults, especially over 40 or with a family history of heart disease.',
    beforeTest: 'Fast for 9-12 hours before the test.',
    keywords: ['cholesterol', 'heart', 'lipid', 'triglycerides'],
  },
  {
    slug: 'tsh',
    name: 'TSH (Thyroid)',
    categorySlug: 'hormone',
    price: 349,
    discountedPrice: 279,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: 'Usually available within 24 hours.',
    whatIsIt: 'Measures thyroid-stimulating hormone, which controls your thyroid gland.',
    whyDone: 'The most common first test to check thyroid function.',
    detects: ['Hypothyroidism', 'Hyperthyroidism'],
    whenRecommended: 'If you have fatigue, weight changes, or a family history of thyroid issues.',
    beforeTest: 'No special preparation needed.',
    keywords: ['thyroid', 'tsh', 't3', 't4'],
  },
  {
    slug: 'ecg',
    name: 'ECG (Electrocardiogram)',
    categorySlug: 'cardiac',
    price: 499,
    sampleType: 'No sample — electrode-based test',
    fastingRequired: false,
    reportTime: 'Immediate.',
    whatIsIt: "A quick recording of your heart's electrical activity.",
    whyDone: 'Checks heart rhythm and can flag signs of strain or past heart issues.',
    detects: ['Irregular heart rhythm', 'Signs of past heart attack', 'Heart strain'],
    whenRecommended: 'For chest pain, palpitations, or as part of a cardiac checkup.',
    beforeTest: 'No preparation needed.',
    keywords: ['heart', 'ecg', 'ekg', 'cardiac'],
  },
  {
    slug: 'vitamin-d',
    name: 'Vitamin D',
    categorySlug: 'vitamin',
    price: 899,
    discountedPrice: 699,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: 'Usually available within 48 hours.',
    whatIsIt: 'Measures your vitamin D level, important for bone and immune health.',
    whyDone: 'Vitamin D deficiency is very common and often has no obvious symptoms.',
    detects: ['Vitamin D deficiency'],
    whenRecommended: 'If you have bone pain, fatigue, or limited sun exposure.',
    beforeTest: 'No fasting required.',
    keywords: ['vitamin d', 'bone', 'deficiency'],
  },
  {
    slug: 'urine-routine',
    name: 'Urine Routine Examination',
    categorySlug: 'urine',
    price: 199,
    sampleType: 'Urine',
    fastingRequired: false,
    reportTime: 'Same day.',
    whatIsIt: 'A basic screen of your urine for infection, sugar, protein, and other markers.',
    whyDone: 'Helps detect urinary tract infections and early signs of kidney or metabolic issues.',
    detects: ['Urinary tract infection', 'Kidney issues', 'Diabetes indicators'],
    whenRecommended: 'For urinary symptoms, or as part of a routine checkup.',
    beforeTest: 'No special preparation needed.',
    keywords: ['urine', 'uti', 'infection'],
  },
];

export interface DiagnosticPackage {
  slug: string;
  title: string;
  description: string;
  testSlugs: string[];
  packagePrice: number;
}

export const diagnosticPackages: DiagnosticPackage[] = [
  {
    slug: 'basic-health-check',
    title: 'Basic Health Check',
    description: 'A well-rounded starting point for an annual checkup.',
    testSlugs: ['cbc', 'fasting-sugar', 'lipid-profile', 'urine-routine'],
    packagePrice: 999,
  },
  {
    slug: 'diabetes-screen',
    title: 'Diabetes Screening',
    description: 'Everything needed to check and track blood sugar control.',
    testSlugs: ['fasting-sugar', 'hba1c'],
    packagePrice: 549,
  },
  {
    slug: 'heart-health',
    title: 'Heart Health Package',
    description: 'A focused look at cardiac risk factors.',
    testSlugs: ['lipid-profile', 'ecg'],
    packagePrice: 899,
  },
];

export function testPrice(t: DiagnosticTest): number {
  return t.discountedPrice ?? t.price;
}

export function individualTotal(pkg: DiagnosticPackage): number {
  return pkg.testSlugs.reduce((sum, slug) => {
    const t = diagnosticTests.find((x) => x.slug === slug);
    return sum + (t ? testPrice(t) : 0);
  }, 0);
}
