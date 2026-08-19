import { services } from '../data/services';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { Reveal } from '../components/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

export function ServicesPage() {
  usePageMeta('Services', 'Doctor consultations, home visits, nursing, diagnostics, physiotherapy, and elderly care — every service delivered by a verified professional.');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="Everything your family needs, at home"
          description="Every service is delivered by a verified professional — requested in minutes, tracked from your account."
        />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={i * 60}>
            <ServiceCard service={service} id={service.slug} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={180} className="mt-16 rounded-2xl border border-line bg-bg-soft p-8 text-center">
        <h2 className="text-2xl font-bold text-navy-900">Not sure which service you need?</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-600">
          Book a doctor home visit first — they can point you toward nursing, diagnostics, or physiotherapy as needed.
        </p>
        <a
          href={`${APP_URL}/signup`}
          className="mt-5 inline-block rounded-full bg-navy-700 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-900"
        >
          Book a Doctor
        </a>
      </Reveal>
    </div>
  );
}
