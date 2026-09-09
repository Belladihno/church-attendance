import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MembersListPage } from '../pages/MembersListPage';
import { AddMemberPage } from '../pages/AddMemberPage';
import { MemberDetailPage } from '../pages/MemberDetailPage';
import { EditMemberPage } from '../pages/EditMemberPage';
import { AttendancePage } from '../pages/AttendancePage';
import { MonthlyAttendancePage } from '../pages/MonthlyAttendancePage';
import { FirstTimersListPage } from '../pages/FirstTimersListPage';
import { AddFirstTimerPage } from '../pages/AddFirstTimerPage';
import { FirstTimerDetailPage } from '../pages/FirstTimerDetailPage';
import { FollowUpsPage } from '../pages/FollowUpsPage';
import { ReportsPage } from '../pages/ReportsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/members', element: <MembersListPage /> },
      { path: '/members/new', element: <AddMemberPage /> },
      { path: '/members/:id', element: <MemberDetailPage /> },
      { path: '/members/:id/edit', element: <EditMemberPage /> },
      { path: '/attendance', element: <AttendancePage /> },
      { path: '/attendance/:year/:month', element: <MonthlyAttendancePage /> },
      { path: '/first-timers', element: <FirstTimersListPage /> },
      { path: '/first-timers/new', element: <AddFirstTimerPage /> },
      { path: '/first-timers/:id', element: <FirstTimerDetailPage /> },
      { path: '/follow-ups', element: <FollowUpsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
