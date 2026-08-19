import { ArrowRight, MapPin, Stethoscope } from 'lucide-react';
import { siteContent } from '../../data/content';
import { Reveal } from '../Reveal';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

const VISIT_STAGES = ['Requested', 'Assigned', 'En route', 'In progress', 'Completed'];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-4 pt-14 md:grid-cols-2 md:pb-8 md:pt-20">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-600">
            Trusted by {siteContent.trustedFamiliesCount} families in {siteContent.city}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl">
            Trusted healthcare, closer to home.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
            Verified doctors and care professionals, at your door. Request a visit, track it in real time, and keep
            every visit in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`${APP_URL}/signup`}
              className="group inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-900"
            >
              Book a Doctor
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href="/services"
              className="rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-700"
            >
              Explore Services
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div
        className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-teal-100 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-14 -right-8 h-56 w-56 rounded-full bg-sage-100 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative rounded-2xl border border-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-700">
            <Stethoscope size={20} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-900">Dr. request in progress</p>
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <MapPin size={12} aria-hidden="true" /> Home visit &middot; {siteContent.city}
            </p>
          </div>
          <span className="ml-auto rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-teal-600">
            En route
          </span>
        </div>

        <ol className="mt-5 space-y-3">
          {VISIT_STAGES.map((stage, i) => {
            const isDone = i <= 2;
            const isCurrent = i === 2;
            return (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span
                  className={
                    isDone
                      ? isCurrent
                        ? 'h-2.5 w-2.5 rounded-full bg-teal-600 ring-4 ring-teal-100'
                        : 'h-2.5 w-2.5 rounded-full bg-navy-700'
                      : 'h-2.5 w-2.5 rounded-full bg-line'
                  }
                  aria-hidden="true"
                />
                <span className={isDone ? 'font-medium text-navy-900' : 'text-ink-400'}>{stage}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
