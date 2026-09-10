import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { GreetingBanner } from '../components/dashboard/GreetingBanner';
import { StatCards } from '../components/dashboard/StatCards';
import { AttendanceTrendChart } from '../components/dashboard/AttendanceTrendChart';
import { FollowUpsPanel } from '../components/dashboard/FollowUpsPanel';
import { BottomActionBar } from '../components/dashboard/BottomActionBar';

export function DashboardPage() {
  const { user } = useAuth();
  const { overview, followUps } = useDashboard();
  const { data, isLoading, error } = overview;

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-brand-red">Failed to load dashboard</div>;
  if (!data) return null;

  const firstName = user?.email?.split('@')[0]?.split('.')[0]
    ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1)
    : 'Bellanzo';
  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6">
      <GreetingBanner firstName={firstName} />
      <StatCards data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AttendanceTrendChart data={data} />
        <FollowUpsPanel data={data} followUps={followUps.data as any} />
      </div>
      <BottomActionBar data={data} todayStr={todayStr} />
    </div>
  );
}
