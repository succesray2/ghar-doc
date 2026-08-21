import { Link } from 'react-router-dom';
import { TERMS_AND_CONDITIONS } from '../../data/legal';
import { LegalDocument } from '../../components/LegalDocument';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/login" className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="Ghar Doc" className="h-8 w-8" />
            <span className="text-lg font-bold">
              <span className="text-blue-700">Ghar</span>
              <span className="text-brand-600">Doc</span>
            </span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
      <LegalDocument body={TERMS_AND_CONDITIONS} />
    </div>
  );
}
