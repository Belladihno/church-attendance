import { PageHeader, EmptyState } from '../components/ui/PageHeader';
export function LoginPage() {
  return (
    <div className="max-w-[420px] mx-auto mt-12">
      <PageHeader title="Sign in" subtitle="Attendance Management System" />
      <EmptyState message="Login form will be built in Step 14.1" />
    </div>
  );
}
