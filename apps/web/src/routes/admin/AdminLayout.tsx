import { AppShell } from '../../components/AppShell';

export function AdminLayout() {
  return (
    <AppShell
      roleLabel="Admin"
      navItems={[
        { to: '/admin/visits', label: 'All Visits' },
        { to: '/admin/doctors', label: 'Doctor Applications' },
        { to: '/admin/nurses', label: 'Nurses' },
        { to: '/admin/physiotherapists', label: 'Physiotherapists' },
        { to: '/admin/safety', label: 'Safety Dashboard' },
        { to: '/admin/settings', label: 'Settings' },
      ]}
    />
  );
}
