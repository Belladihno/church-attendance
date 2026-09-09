import { PageHeader, EmptyState } from '../components/ui/PageHeader';
export function AttendancePage() {
  return (
    <div>
      <PageHeader title="Attendance" subtitle="Member × Sunday matrix" />
      <EmptyState message="Attendance grid with bulk save — Step 14.6" />
    </div>
  );
}
