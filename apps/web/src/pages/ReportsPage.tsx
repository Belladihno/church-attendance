import { PageHeader } from '../components/ui/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../api/dashboard';

export function ReportsPage() {
  const { data } = useQuery({ queryKey: ['reports-overview'], queryFn: () => getOverview() });
  return (
    <div>
      <PageHeader title="Reports" subtitle="Attendance trends and absence exports" />
      <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card">
        <h3 className="font-semibold">Attendance trend</h3>
        <p className="text-sm text-text-secondary">Current: {data?.trend.current.toFixed(1)}% Previous: {data?.trend.previous.toFixed(1)}% Delta: {data?.trend.delta.toFixed(1)}%</p>
        <div className="mt-4 text-sm">Total members: {data?.totalMembers} Present today: {data?.presentToday} Absent: {data?.absentToday}</div>
      </div>
    </div>
  );
}
