import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { HomePage } from './HomePage';
import { ServicesPage } from './ServicesPage';
import { DiagnosticsPage } from './DiagnosticsPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { TermsPage } from './TermsPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'diagnostics', element: <DiagnosticsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },
]);
