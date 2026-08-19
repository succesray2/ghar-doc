import { Hero } from '../components/sections/Hero';
import { ServicesSection } from '../components/sections/ServicesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TrustSection } from '../components/sections/TrustSection';
import { DoctorVettingSection } from '../components/sections/DoctorVettingSection';
import { FamilySection } from '../components/sections/FamilySection';
import { AppShowcaseSection } from '../components/sections/AppShowcaseSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { FinalCtaSection } from '../components/sections/FinalCtaSection';

export function HomePage() {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSection />
      <DoctorVettingSection />
      <FamilySection />
      <AppShowcaseSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
