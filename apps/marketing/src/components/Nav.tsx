import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

const NAV_LINKS = [
  { to: '/', label: 'Home', hash: false },
  { to: '/services', label: 'Services', hash: false },
  { to: '/diagnostics', label: 'Diagnostics', hash: false },
  { to: '/#how-it-works', label: 'How It Works', hash: true },
  { to: '/about', label: 'About', hash: false },
  { to: '/contact', label: 'Contact', hash: false },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b bg-bg/90 backdrop-blur transition-all duration-300',
        scrolled ? 'border-line shadow-soft' : 'border-transparent',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-300',
          scrolled ? 'py-2.5' : 'py-4',
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-icon.png" alt="" className={clsx('w-auto transition-all duration-300', scrolled ? 'h-8' : 'h-10')} />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-navy-700">Ghar</span>
            <span className="text-teal-600">Doc</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive && !link.hash ? 'text-navy-900' : 'text-ink-600 hover:text-navy-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href={`${APP_URL}/login`} className="text-sm font-medium text-ink-600 hover:text-navy-900">
            Sign in
          </a>
          <a
            href={`${APP_URL}/signup`}
            className="rounded-full bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-navy-900"
          >
            Book a Doctor
          </a>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-ink-600 hover:bg-bg-soft md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-md px-3 py-2.5 text-sm font-medium',
                    isActive && !link.hash ? 'bg-bg-soft text-navy-900' : 'text-ink-600',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
              <a href={`${APP_URL}/login`} className="px-3 py-1 text-sm font-medium text-ink-600">
                Sign in
              </a>
              <a
                href={`${APP_URL}/signup`}
                className="rounded-full bg-navy-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Book a Doctor
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
