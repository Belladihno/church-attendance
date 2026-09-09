import { PageHeader, EmptyState } from '../components/ui/PageHeader';
export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Executive operational snapshot" />
      <EmptyState message="Dashboard StatCards + trend chart + follow-up queue — Step 14.2" />
    </div>
  );
}
