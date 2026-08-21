import { ProfileSection } from '../../components/settings/ProfileSection';
import { SecuritySection } from '../../components/settings/SecuritySection';

export function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
      <ProfileSection />
      <SecuritySection />
    </div>
  );
}
