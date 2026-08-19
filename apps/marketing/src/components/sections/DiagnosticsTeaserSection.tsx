import { ArrowRight, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { Reveal } from '../Reveal';

export function DiagnosticsTeaserSection() {
  return (
    <Section id="diagnostics" tone="soft">
      <Reveal className="grid items-center gap-8 rounded-3xl border border-line bg-white p-8 shadow-soft md:grid-cols-[auto_1fr_auto] md:p-10">
        <span className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
          <FlaskConical size={26} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <SectionHeading
            eyebrow="Coming soon"
            title="Diagnostics, made easier to understand."
            description="We're building a diagnostic testing service — search tests, see what they check for and how to prepare, and view pricing before you book. We'll share details here as it becomes available."
          />
        </div>
        <Link
          to="/diagnostics"
          className="group inline-flex flex-shrink-0 items-center gap-2 self-start rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-700 md:self-center"
        >
          Learn more
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}
