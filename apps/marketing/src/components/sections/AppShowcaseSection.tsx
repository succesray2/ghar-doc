import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { IconTile } from '../IconTile';
import { Reveal } from '../Reveal';
import { PhoneMockup } from '../PhoneMockup';
import type { IconName } from '../../lib/icons';

export function AppShowcaseSection() {
  return (
    <Section id="app" tone="soft">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal className="order-2 flex justify-center lg:order-1">
          <PhoneMockup />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="mb-3 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-600">
              Coming soon
            </p>
            <SectionHeading title="Your healthcare, always within reach." />
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink-600">
              The Ghar Doc app is in development. Everything below already works today in our web app — the app
              brings the same experience to your pocket.
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            {siteContent.appPreview.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="flex gap-4">
                <IconTile icon={item.icon as IconName} tone="navy" size="sm" />
                <div>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
