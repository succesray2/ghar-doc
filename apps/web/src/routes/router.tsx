import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Role } from '@ghar-doc/shared';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RootLayout } from './RootLayout';
import { LoginPage } from './auth/LoginPage';
import { SignupPage } from './auth/SignupPage';
import { PatientLayout } from './patient/PatientLayout';
import { BookServicePage } from './patient/BookServicePage';
import { RequestVisitPage } from './patient/RequestVisitPage';
import { RequestNursingPage } from './patient/RequestNursingPage';
import { RequestPhysiotherapyPage } from './patient/RequestPhysiotherapyPage';
import { MyVisitsPage } from './patient/MyVisitsPage';
import { PatientSettingsPage } from './patient/PatientSettingsPage';
import { DoctorLayout } from './doctor/DoctorLayout';
import { AssignedVisitsPage } from './doctor/AssignedVisitsPage';
import { DoctorSettingsPage } from './doctor/DoctorSettingsPage';
import { NurseLayout } from './nurse/NurseLayout';
import { AssignedVisitsPage as NurseAssignedVisitsPage } from './nurse/AssignedVisitsPage';
import { NurseSettingsPage } from './nurse/NurseSettingsPage';
import { PhysiotherapistLayout } from './physiotherapist/PhysiotherapistLayout';
import { AssignedVisitsPage as PhysiotherapistAssignedVisitsPage } from './physiotherapist/AssignedVisitsPage';
import { PhysiotherapistSettingsPage } from './physiotherapist/PhysiotherapistSettingsPage';
import { AdminLayout } from './admin/AdminLayout';
import { AllVisitsPage } from './admin/AllVisitsPage';
import { DoctorApplicationsPage } from './admin/DoctorApplicationsPage';
import { NursesDirectoryPage } from './admin/NursesDirectoryPage';
import { PhysiotherapistsDirectoryPage } from './admin/PhysiotherapistsDirectoryPage';
import { SafetyDashboardPage } from './admin/SafetyDashboardPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';
import { TermsPage } from './legal/TermsPage';
import { PrivacyPolicyPage } from './legal/PrivacyPolicyPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/privacy', element: <PrivacyPolicyPage /> },
      {
        element: <ProtectedRoute allow={[Role.PATIENT]} />,
        children: [
          {
            path: '/patient',
            element: <PatientLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'book', element: <BookServicePage /> },
              { path: 'request', element: <RequestVisitPage /> },
              { path: 'request-nursing', element: <RequestNursingPage /> },
              { path: 'request-physiotherapy', element: <RequestPhysiotherapyPage /> },
              { path: 'visits', element: <MyVisitsPage /> },
              { path: 'settings', element: <PatientSettingsPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allow={[Role.DOCTOR]} />,
        children: [
          {
            path: '/doctor',
            element: <DoctorLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'visits', element: <AssignedVisitsPage /> },
              { path: 'settings', element: <DoctorSettingsPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allow={[Role.NURSE]} />,
        children: [
          {
            path: '/nurse',
            element: <NurseLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'visits', element: <NurseAssignedVisitsPage /> },
              { path: 'settings', element: <NurseSettingsPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allow={[Role.PHYSIOTHERAPIST]} />,
        children: [
          {
            path: '/physio',
            element: <PhysiotherapistLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'visits', element: <PhysiotherapistAssignedVisitsPage /> },
              { path: 'settings', element: <PhysiotherapistSettingsPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allow={[Role.ADMIN]} />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'visits', element: <AllVisitsPage /> },
              { path: 'doctors', element: <DoctorApplicationsPage /> },
              { path: 'nurses', element: <NursesDirectoryPage /> },
              { path: 'physiotherapists', element: <PhysiotherapistsDirectoryPage /> },
              { path: 'safety', element: <SafetyDashboardPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);
