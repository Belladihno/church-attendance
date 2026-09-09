import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMember } from '../api/members';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function MemberDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['member', id], queryFn: () => getMember(id!), enabled: !!id });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">Not found</div>;

  return (
    <div>
      <PageHeader
        title={`${data.firstName} ${data.lastName}`}
        subtitle={`${data.churchRole} • ${data.department}`}
        actions={<Link to={`/members/${id}/edit`}><Button variant="secondary">Edit member</Button></Link>}
      />
      <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-text-secondary">Phone:</span> {data.phone}</div>
          <div><span className="text-text-secondary">Gender:</span> {data.gender}</div>
          <div><span className="text-text-secondary">Address:</span> {data.address}</div>
          <div><span className="text-text-secondary">Joined:</span> {data.dateJoined}</div>
          <div><span className="text-text-secondary">Status:</span> <Badge variant={data.status === 'ACTIVE' ? 'active' : 'excused'}>{data.status.toLowerCase()}</Badge></div>
        </div>
        {data.attendance && (
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="font-semibold text-text-primary">Attendance</h3>
            <p className="text-sm text-text-secondary">Rate: {data.attendance.rate}%</p>
            <div className="mt-2 text-xs text-text-secondary">History: {data.attendance.history.length} records</div>
          </div>
        )}
      </div>
    </div>
  );
}
