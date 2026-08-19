import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../Reveal';

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" tone="soft">
      <Reveal>
        <SectionHeading eyebrow="How it works" title="Four steps to care" center />
      </Reveal>

      <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="absolute left-0 right-0 top-6 hidden h-px bg-line lg:block"
          aria-hidden="true"
        />
        {siteContent.howItWorks.map((step, i) => (
          <Reveal key={step.step} delay={i * 90} className="relative text-center">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white ring-8 ring-bg-soft">
              {step.step}
            </div>
            <p className="mt-4 font-semibold text-navy-900">{step.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
