import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { convertToMember } from '../api/firstTimers';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function FirstTimerDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['first-timer', id], queryFn: () => apiClient.get(`/first-timers/${id}`).then(r => r.data), enabled: !!id });
  const mut = useMutation({ mutationFn: () => convertToMember(id!), onSuccess: () => qc.invalidateQueries({ queryKey: ['first-timer', id] }) });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">Not found</div>;

  return (
    <div>
      <PageHeader title={`${data.firstName} ${data.lastName}`} actions={data.followUpStatus !== 'CONVERTED' && <Button onClick={() => mut.mutate()} disabled={mut.isPending}>Convert to member</Button>} />
      <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="text-sm"><span className="text-text-secondary">Phone:</span> {data.phone}</div>
        <div className="text-sm"><span className="text-text-secondary">Status:</span> <Badge variant="pending">{data.followUpStatus.toLowerCase()}</Badge></div>
        {mut.isError && <div className="text-sm text-brand-red mt-2">{(mut.error as any)?.response?.data?.message}</div>}
      </div>
    </div>
  );
}
