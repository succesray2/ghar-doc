import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Role } from '@ghar-doc/shared';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { RootLayout } from './RootLayout';
import { LoginPage } from './auth/LoginPage';
import { SignupPage } from './auth/SignupPage';
import { PatientLayout } from './patient/PatientLayout';
import { RequestVisitPage } from './patient/RequestVisitPage';
import { MyVisitsPage } from './patient/MyVisitsPage';
import { DoctorLayout } from './doctor/DoctorLayout';
import { AssignedVisitsPage } from './doctor/AssignedVisitsPage';
import { AdminLayout } from './admin/AdminLayout';
import { AllVisitsPage } from './admin/AllVisitsPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        element: <ProtectedRoute allow={[Role.PATIENT]} />,
        children: [
          {
            path: '/patient',
            element: <PatientLayout />,
            children: [
              { index: true, element: <Navigate to="visits" replace /> },
              { path: 'request', element: <RequestVisitPage /> },
              { path: 'visits', element: <MyVisitsPage /> },
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
            ],
          },
        ],
      },
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);
