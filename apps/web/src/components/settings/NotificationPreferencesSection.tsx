import type { NotificationPreferencesDto } from '@ghar-doc/shared';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../../hooks/useNotifications';
import { Card } from '../ui/Card';

const LABELS: { key: keyof NotificationPreferencesDto; label: string; description: string }[] = [
  { key: 'bookingUpdates', label: 'Booking updates', description: 'Request received, reassignment, and other booking status changes' },
  { key: 'providerAssignment', label: 'Provider assignment', description: 'When a provider is assigned to or accepts your visit' },
  { key: 'providerArrival', label: 'Provider arrival', description: 'When your provider arrives' },
  { key: 'serviceUpdates', label: 'Service updates', description: 'Updates about the service itself' },
  { key: 'paymentUpdates', label: 'Payment updates', description: 'Payment-related notifications' },
  { key: 'generalNotifications', label: 'General', description: 'Everything else from GharDoc' },
];

export function NotificationPreferencesSection() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();

  return (
    <Card>
      <h2 className="mb-1 text-base font-semibold text-slate-800">Notifications</h2>
      <p className="mb-4 text-sm text-slate-500">
        These control your in-app notification feed. There's no SMS or push delivery yet — everything appears here in the app.
      </p>
      {isLoading || !prefs ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {LABELS.map(({ key, label, description }) => (
            <li key={key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{description}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => updatePrefs.mutate({ [key]: !prefs[key] })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prefs[key] ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    prefs[key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
