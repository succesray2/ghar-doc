import { ProfileSection } from '../../components/settings/ProfileSection';
import { SecuritySection } from '../../components/settings/SecuritySection';
import { NotificationPreferencesSection } from '../../components/settings/NotificationPreferencesSection';
import { LegalSupportSection } from '../../components/settings/LegalSupportSection';

export function NurseSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
      <ProfileSection />
      <NotificationPreferencesSection />
      <SecuritySection />
      <LegalSupportSection />
    </div>
  );
}
