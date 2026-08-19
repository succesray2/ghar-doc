import { Quote } from 'lucide-react';
import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../Reveal';

// Not currently rendered on HomePage — the data behind it
// (siteContent.testimonials) is explicitly placeholder ("Placeholder
// Patient"), and this site doesn't fabricate testimonials. Wire this back
// into HomePage once real patient quotes exist to replace that data.
export function TestimonialsSection() {
  return (
    <Section id="testimonials" tone="soft">
      <Reveal>
        <SectionHeading eyebrow="Patient stories" title="What families are saying" center />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {siteContent.testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 80} className="rounded-2xl border border-line bg-white p-6">
            <Quote size={22} className="text-teal-600" aria-hidden="true" />
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{t.quote}</p>
            <p className="mt-4 text-sm font-semibold text-navy-900">
              {t.name} <span className="font-normal text-ink-400">· {t.area}</span>
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
