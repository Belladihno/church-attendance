import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../api/dashboard';
import { StatCard } from '../components/ui/StatCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-brand-red">Failed to load dashboard</div>;
  if (!data) return null;

  return (
    <div>
      <PageHeader title="Good morning, Adaeze" subtitle="Executive operational snapshot" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total members" value={data.totalMembers} sub="Active on roll" icon={<Users size={18} />} />
        <StatCard label="Present today" value={data.presentToday} sub={`Attendance rate ${data.attendanceRate}%`} icon={<UserCheck size={18} />} />
        <StatCard label="Absent today" value={data.absentToday} sub={`${data.followUpRequired.twoWeeks} require follow-up`} icon={<UserX size={18} />} />
        <StatCard label="First timers" value={data.firstTimersThisMonth} sub="This month" icon={<UserPlus size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-semibold text-text-primary">Attendance trend</h2>
          <p className="text-sm text-text-secondary">Previous: {data.trend.previous.toFixed(1)}% Current: {data.trend.current.toFixed(1)}% Delta: {data.trend.delta.toFixed(1)}%</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-semibold text-text-primary">Follow-ups needing attention</h2>
          <p className="text-sm text-text-secondary">Two weeks: {data.followUpRequired.twoWeeks} Three+: {data.followUpRequired.threeOrMore}</p>
        </div>
      </div>
    </div>
  );
}
