import { TERMS_AND_CONDITIONS } from '../data/legal';
import { LegalDocument } from '../components/LegalDocument';
import { usePageMeta } from '../hooks/usePageMeta';

export function TermsPage() {
  usePageMeta('Terms & Conditions', "Ghar Doc's terms and conditions.");

  return <LegalDocument body={TERMS_AND_CONDITIONS} />;
}
