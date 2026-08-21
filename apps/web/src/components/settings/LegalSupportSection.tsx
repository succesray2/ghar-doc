import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

const SUPPORT_EMAIL = 'care@ghardoc.com';

export function LegalSupportSection() {
  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-slate-800">Privacy, legal &amp; support</h2>
      <ul className="divide-y divide-slate-100 text-sm">
        <li className="py-2.5">
          <Link to="/privacy" className="text-brand-600 hover:underline">
            Privacy Policy
          </Link>
        </li>
        <li className="py-2.5">
          <Link to="/terms" className="text-brand-600 hover:underline">
            Terms &amp; Conditions
          </Link>
        </li>
        <li className="py-2.5">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-600 hover:underline">
            Contact support
          </a>
        </li>
        <li className="py-2.5">
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Account%20deletion%20request`} className="text-brand-600 hover:underline">
            Request account deletion or data export
          </a>
          <p className="mt-0.5 text-xs text-slate-400">Not yet self-serve — a support request is actioned manually.</p>
        </li>
      </ul>
      <p className="mt-4 text-xs text-slate-400">GharDoc web · v1</p>
    </Card>
  );
}
