import { ArrowRight } from 'lucide-react';
import { Section } from '../Section';
import { Reveal } from '../Reveal';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

export function FinalCtaSection() {
  return (
    <Section tone="dark" className="text-center">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Better healthcare starts closer to home.</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/80">
          Verified doctors, at your door, tracked from request to completion.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`${APP_URL}/signup`}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 shadow-soft transition-colors hover:bg-teal-100"
          >
            Book a Doctor
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#app"
            className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white"
          >
            See the app (coming soon)
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
