import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { ServiceCard } from '../ServiceCard';
import { Reveal } from '../Reveal';

export function ServicesSection() {
  return (
    <Section id="services">
      <Reveal>
        <SectionHeading
          eyebrow="What we offer"
          title="Every core service, right at your door"
          description="From a routine checkup to ongoing nursing care, one trusted platform covers your family."
        />
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={i * 60}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={180}>
        <Link
          to="/services"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900"
        >
          View all services
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}
