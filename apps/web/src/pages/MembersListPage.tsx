import { PageHeader, EmptyState } from '../components/ui/PageHeader';
export function MembersListPage() {
  return (
    <div>
      <PageHeader title="Members Directory" subtitle="362 registered members" actions={<button className="px-4 py-2 rounded-lg bg-brand-purple text-white text-sm">Add member</button>} />
      <EmptyState message="Members table with search, filters, pagination — Step 14.3" />
    </div>
  );
}
