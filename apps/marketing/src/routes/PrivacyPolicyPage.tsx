import { PRIVACY_POLICY } from '../data/privacy';
import { LegalDocument } from '../components/LegalDocument';
import { usePageMeta } from '../hooks/usePageMeta';

export function PrivacyPolicyPage() {
  usePageMeta('Privacy Policy', "Ghar Doc's privacy policy — what data we collect, why, and how it's protected.");

  return <LegalDocument body={PRIVACY_POLICY} />;
}
