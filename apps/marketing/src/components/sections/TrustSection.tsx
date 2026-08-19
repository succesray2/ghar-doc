import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { IconTile } from '../IconTile';
import { Reveal } from '../Reveal';
import type { IconName } from '../../lib/icons';

export function TrustSection() {
  return (
    <Section id="trust">
      <Reveal>
        <SectionHeading eyebrow="Why families trust us" title="Care you can verify" />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {siteContent.trustPoints.map((point, i) => (
          <Reveal key={point.title} delay={i * 60} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
            <IconTile icon={point.icon as IconName} tone="navy" />
            <div>
              <p className="font-semibold text-navy-900">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{point.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
