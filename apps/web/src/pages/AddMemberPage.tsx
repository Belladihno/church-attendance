import { PageHeader, EmptyState } from '../components/ui/PageHeader';
export function AddMemberPage() {
  return (
    <div>
      <PageHeader title="Add member" subtitle="Register congregant" />
      <EmptyState message="AddMember form — Step 14.4" />
    </div>
  );
}
