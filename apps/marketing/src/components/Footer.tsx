import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { siteContent } from '../data/content';
import { services } from '../data/services';
import { AppStoreBadges } from './AppStoreBadges';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <img src="/logo-icon.png" alt="" className="h-9 w-9" />
            <span className="text-lg font-bold">
              <span className="text-navy-700">Ghar</span>
              <span className="text-teal-600">Doc</span>
            </span>
          </div>
          <p className="max-w-xs text-sm text-ink-600">
            Trusted healthcare, closer to home. Verified doctors and care professionals, at your door.
          </p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Get the app</p>
            <AppStoreBadges />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-navy-900">Company</p>
          <ul className="space-y-2.5 text-sm text-ink-600">
            <li><Link to="/about" className="hover:text-navy-900">About</Link></li>
            <li><Link to="/services" className="hover:text-navy-900">Services</Link></li>
            <li><Link to="/contact" className="hover:text-navy-900">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-navy-900">Services</p>
          <ul className="space-y-2.5 text-sm text-ink-600">
            {services.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link to={`/services#${s.slug}`} className="hover:text-navy-900">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="font-medium text-teal-600 hover:text-navy-900">
                View all services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-navy-900">For Patients</p>
          <ul className="space-y-2.5 text-sm text-ink-600">
            <li><a href={`${APP_URL}/patient/request`} className="hover:text-navy-900">Request a Visit</a></li>
            <li><a href={`${APP_URL}/patient/visits`} className="hover:text-navy-900">My Visits</a></li>
            <li><a href={`${APP_URL}/login`} className="hover:text-navy-900">Sign in</a></li>
          </ul>

          <p className="mb-3 mt-6 text-sm font-semibold text-navy-900">Support</p>
          <ul className="space-y-2.5 text-sm text-ink-600">
            <li><Link to="/privacy" className="hover:text-navy-900">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-navy-900">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ghar Doc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href={`tel:${siteContent.phoneHref}`} className="flex items-center gap-1.5 hover:text-navy-900">
              <Phone size={14} aria-hidden="true" /> {siteContent.phoneDisplay}
            </a>
            <a href={`mailto:${siteContent.email}`} className="flex items-center gap-1.5 hover:text-navy-900">
              <Mail size={14} aria-hidden="true" /> {siteContent.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
