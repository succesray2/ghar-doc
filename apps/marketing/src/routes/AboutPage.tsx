import { siteContent } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { IconTile } from '../components/IconTile';
import { Reveal } from '../components/Reveal';
import type { IconName } from '../lib/icons';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="About Ghar Doc"
          title="Healthcare that comes to you"
          description="Placeholder mission statement — replace with Ghar Doc's real story: why it was founded, what problem it solves, and what makes its model different from a marketplace of freelance doctors."
        />
      </Reveal>

      <Reveal delay={80} className="mt-12 rounded-2xl border border-line bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Medical leadership</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">{siteContent.founder.name}</h2>
        <p className="text-ink-400">{siteContent.founder.credentials}</p>
        <p className="mt-4 leading-relaxed text-ink-600">{siteContent.founder.bio}</p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {siteContent.trustPoints.map((point, i) => (
          <Reveal key={point.title} delay={i * 60} className="flex gap-4 rounded-2xl border border-line p-5">
            <IconTile icon={point.icon as IconName} tone="navy" size="sm" />
            <div>
              <p className="font-semibold text-navy-900">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{point.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
