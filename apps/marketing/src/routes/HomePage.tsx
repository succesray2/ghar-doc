import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/sections/Hero';
import { ServicesSection } from '../components/sections/ServicesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TrustSection } from '../components/sections/TrustSection';
import { DoctorVettingSection } from '../components/sections/DoctorVettingSection';
import { DiagnosticsTeaserSection } from '../components/sections/DiagnosticsTeaserSection';
import { FamilySection } from '../components/sections/FamilySection';
import { AppShowcaseSection } from '../components/sections/AppShowcaseSection';
import { EmergencyNoticeSection } from '../components/sections/EmergencyNoticeSection';
import { FaqSection } from '../components/sections/FaqSection';
import { FinalCtaSection } from '../components/sections/FinalCtaSection';

// TestimonialsSection is deliberately not rendered — no genuine patient
// testimonials exist yet, and this site doesn't fabricate them (see the
// component file itself for the same note). Re-enable once real ones exist.

export function HomePage() {
  usePageMeta(
    'Doctor Home Visits',
    'Ghar Doc brings verified doctors to your door. Request a visit, track it in real time, and manage your care from one account.',
  );

  return (
    <div>
      <Hero />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSection />
      <DoctorVettingSection />
      <DiagnosticsTeaserSection />
      <FamilySection />
      <AppShowcaseSection />
      <FaqSection />
      <EmergencyNoticeSection />
      <FinalCtaSection />
    </div>
  );
}
