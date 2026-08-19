import { ArrowRight } from 'lucide-react';
import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { IconTile } from '../IconTile';
import { Reveal } from '../Reveal';
import type { IconName } from '../../lib/icons';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

export function DoctorVettingSection() {
  return (
    <Section id="doctors" tone="soft">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Our doctors"
            title="Every doctor meets the same standard"
            description="We don't list doctors until they clear every one of these checks — so whoever arrives at your door has already earned your trust."
          />
          <a
            href={`${APP_URL}/signup`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900"
          >
            Book a verified doctor
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {siteContent.doctorVetting.map((item, i) => (
            <Reveal key={item.title} delay={i * 70} className="rounded-2xl border border-line bg-white p-5">
              <IconTile icon={item.icon as IconName} tone="sage" size="sm" />
              <p className="mt-3 font-semibold text-navy-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
