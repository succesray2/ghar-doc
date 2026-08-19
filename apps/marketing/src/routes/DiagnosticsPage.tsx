import { ArrowRight, Droplet, Heart, HeartPulse, Baby as BabyIcon, ShieldCheck as ShieldIcon, Salad, PersonStanding, UserRound } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { siteContent } from '../data/content';
import { usePageMeta } from '../hooks/usePageMeta';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

const PLANNED_CATEGORIES = [
  { icon: Droplet, label: 'Blood Tests' },
  { icon: HeartPulse, label: 'Diabetes' },
  { icon: Salad, label: 'Thyroid & Hormones' },
  { icon: Heart, label: 'Heart Health' },
  { icon: UserRound, label: "Women's Health" },
  { icon: PersonStanding, label: "Men's Health" },
  { icon: BabyIcon, label: 'Child Health' },
  { icon: ShieldIcon, label: 'Preventive Health' },
];

export function DiagnosticsPage() {
  usePageMeta('Diagnostics', "Ghar Doc's diagnostic testing service is coming soon — clear test information, transparent pricing, and home sample collection.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Coming soon"
          title="Diagnostics, made easier to understand."
          description="We're building a diagnostic testing service designed around the same idea as our doctor visits: clear information first, so you know what a test involves and why it might be recommended before you book it."
        />
      </Reveal>

      <Reveal delay={80} className="mt-10 rounded-2xl border border-line bg-white p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-600">What to expect</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
          <li>Search tests and health packages by name, category, or condition</li>
          <li>Plain-language explanations of what a test checks and why it's used</li>
          <li>Preparation requirements, sample type, and expected report time up front</li>
          <li>Transparent pricing before you book</li>
          <li>Home sample collection, where available</li>
        </ul>
      </Reveal>

      <Reveal delay={140} className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">Categories we're planning to cover</h2>
        <p className="mt-1 text-sm text-ink-400">The exact test catalogue isn't live yet — this is the scope we're building toward.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PLANNED_CATEGORIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-white p-4 text-center">
              <Icon size={20} strokeWidth={1.75} className="text-teal-600" aria-hidden="true" />
              <span className="text-xs font-medium text-navy-900">{label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-12 rounded-2xl border border-line bg-bg-soft p-8 text-center">
        <h2 className="text-xl font-bold text-navy-900">Need care sooner?</h2>
        <p className="mx-auto mt-2 max-w-lg text-ink-600">
          Doctor home visits are live today — a doctor can assess your symptoms and advise on next steps, including
          any testing you might need.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`${APP_URL}/signup`}
            className="group inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-900"
          >
            Book a Doctor
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${siteContent.email}?subject=Notify me when Diagnostics launches`}
            className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-700"
          >
            Notify me when it's ready
          </a>
        </div>
      </Reveal>
    </div>
  );
}
