import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFollowUps, updateFollowUp } from '../api/followUps';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { useState } from 'react';

export function FollowUpsPage() {
  const [status, setStatus] = useState('');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['follow-ups', status], queryFn: () => getFollowUps(status ? { status } : undefined) as Promise<any[]> });
  const mut = useMutation({ mutationFn: ({ id, s }: { id: string; s: string }) => updateFollowUp(id, { status: s }), onSuccess: () => qc.invalidateQueries({ queryKey: ['follow-ups'] }) });

  return (
    <div>
      <PageHeader title="Follow-ups" />
      <div className="mb-4">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="PENDING">Pending</option>
          <option value="CONTACTED">Contacted</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </Select>
      </div>
      {isLoading ? <div className="text-center p-8">Loading...</div> : (
        <Table>
          <TableHead><TableHeader>Reason</TableHeader><TableHeader>Assigned</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader></TableHead>
          <TableBody>
            {(data || []).map((f: any, idx: number) => (
              <TableRow key={f.id} alt={idx % 2 === 1}>
                <TableCell>{f.reason}</TableCell>
                <TableCell>{f.assignedTo || '-'}</TableCell>
                <TableCell><Badge variant={f.status === 'PENDING' ? 'pending' : f.status === 'CONTACTED' ? 'contacted' : 'active'}>{f.status.toLowerCase()}</Badge></TableCell>
                <TableCell><select value={f.status} onChange={(e) => mut.mutate({ id: f.id, s: e.target.value })} className="text-sm border rounded px-2 py-1"><option>PENDING</option><option>CONTACTED</option><option>RESOLVED</option><option>CLOSED</option></select></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
