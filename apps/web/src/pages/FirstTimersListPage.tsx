import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFirstTimers } from '../api/firstTimers';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function FirstTimersListPage() {
  const { data, isLoading } = useQuery({ queryKey: ['first-timers'], queryFn: () => getFirstTimers() as Promise<any[]> });

  return (
    <div>
      <PageHeader title="First timers" actions={<Link to="/first-timers/new"><Button>Add first timer</Button></Link>} />
      {isLoading ? <div className="text-center p-8">Loading...</div> : (
        <Table>
          <TableHead><TableHeader>Name</TableHeader><TableHeader>Phone</TableHeader><TableHeader>Date</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader></TableHead>
          <TableBody>
            {(data || []).map((ft: any, idx: number) => (
              <TableRow key={ft.id} alt={idx % 2 === 1}>
                <TableCell>{ft.firstName} {ft.lastName}</TableCell>
                <TableCell>{ft.phone}</TableCell>
                <TableCell>{ft.dateAttended}</TableCell>
                <TableCell><Badge variant={ft.followUpStatus === 'PENDING' ? 'pending' : ft.followUpStatus === 'CONTACTED' ? 'contacted' : 'active'}>{ft.followUpStatus.toLowerCase()}</Badge></TableCell>
                <TableCell><Link to={`/first-timers/${ft.id}`} className="text-brand-purple text-sm">View</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
