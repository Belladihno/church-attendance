import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { GreetingBanner } from '../components/dashboard/GreetingBanner';
import { StatCards } from '../components/dashboard/StatCards';
import { AttendanceTrendChart } from '../components/dashboard/AttendanceTrendChart';
import { FollowUpsPanel } from '../components/dashboard/FollowUpsPanel';
import { BottomActionBar } from '../components/dashboard/BottomActionBar';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DashboardSkeleton } from '../components/ui/skeletons/DashboardSkeleton';

export function DashboardPage() {
  const { user } = useAuth();
  const { overview, followUps, memberStats } = useDashboard();
  const { data, isLoading, error } = overview;

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-center text-brand-red">Failed to load dashboard</div>;
  if (!data) return null;

  const firstName = user?.email?.split('@')[0]?.split('.')[0]
    ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1)
    : 'Bellanzo';
  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-4 md:gap-6 max-w-md md:max-w-none mx-auto w-full">
      {/* Mobile order: greeting → hero → metrics → actions → trend → care.
          Desktop order preserved via md:order-*: greeting → metrics → trend+care → action bar. */}
      <div className="order-1 md:order-1">
        <GreetingBanner firstName={firstName} />
      </div>
      <div className="order-2 md:order-4">
        <BottomActionBar data={data} todayStr={todayStr} />
      </div>
      <div className="order-3 md:order-2">
        <StatCards data={data} newThisMonth={memberStats.data?.newThisMonth ?? 0} />
      </div>
      <div className="order-4 md:hidden">
        <QuickActions />
      </div>
      <div className="order-5 md:order-3 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <AttendanceTrendChart data={data} />
        <FollowUpsPanel data={data} followUps={followUps.data as any} />
      </div>
    </div>
  );
}
