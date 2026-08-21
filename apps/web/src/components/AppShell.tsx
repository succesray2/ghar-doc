import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../lib/auth-store';
import { useLogout } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { NotificationBell } from './NotificationBell';

interface NavItem {
  to: string;
  label: string;
}

export function AppShell({ navItems, roleLabel }: { navItems: NavItem[]; roleLabel: string }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <img src="/logo-icon.png" alt="" className="h-8 w-8" />
              <span className="text-lg font-bold">
                <span className="text-blue-700">Ghar</span>
                <span className="text-brand-600">Doc</span>
              </span>
            </span>
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-md px-3 py-1.5 text-sm font-medium',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <NotificationBell />
            <span className="text-slate-500">
              {user?.firstName} {user?.lastName} · {roleLabel}
            </span>
            <Button variant="secondary" onClick={() => logout.mutate()}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
