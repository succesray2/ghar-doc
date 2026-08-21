import { AppShell } from '../../components/AppShell';

export function AdminLayout() {
  return (
    <AppShell
      roleLabel="Admin"
      navItems={[
        { to: '/admin/visits', label: 'All Visits' },
        { to: '/admin/doctors', label: 'Doctor Applications' },
        { to: '/admin/safety', label: 'Safety Dashboard' },
      ]}
    />
  );
}
