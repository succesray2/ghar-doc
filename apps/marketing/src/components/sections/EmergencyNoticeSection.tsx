import { AlertTriangle } from 'lucide-react';
import { Section } from '../Section';
import { Reveal } from '../Reveal';

// Real, non-business-specific safety information (108 is India's actual
// national ambulance number) — not a Ghar Doc claim, so it's exempt from
// the "don't invent facts" rule that governs the rest of this site's copy.
export function EmergencyNoticeSection() {
  return (
    <Section className="!py-8">
      <Reveal className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 sm:items-center">
        <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-rose-600 sm:mt-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-rose-900">
          <span className="font-semibold">Need emergency medical help? </span>
          Ghar Doc is not a substitute for emergency medical services. For serious or life-threatening symptoms, call{' '}
          <a href="tel:108" className="font-semibold underline underline-offset-2">
            108
          </a>{' '}
          or seek immediate emergency care.
        </p>
      </Reveal>
    </Section>
  );
}
