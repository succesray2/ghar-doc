import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { IconTile } from '../IconTile';
import { Reveal } from '../Reveal';
import type { IconName } from '../../lib/icons';

export function FamilySection() {
  return (
    <Section id="family">
      <Reveal>
        <SectionHeading
          eyebrow="For every generation"
          title="Care for you. Care for your whole family."
          description="Whichever stage of life someone in your home is at, Ghar Doc fits around them — not the other way around."
        />
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {siteContent.familyAudiences.map((a, i) => (
          <Reveal key={a.label} delay={i * 70} className="rounded-2xl border border-line bg-white p-5 text-center">
            <IconTile icon={a.icon as IconName} tone="teal" />
            <p className="mt-4 font-semibold text-navy-900">{a.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{a.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
