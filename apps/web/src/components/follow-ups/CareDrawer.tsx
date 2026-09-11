import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Send } from 'lucide-react';
import { getFollowUp, updateFollowUp } from '../../api/followUps';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { subjectOf, statusLabel } from './labels';

function statusVariant(s: string): 'pending' | 'contacted' | 'active' | 'excused' {
  if (s === 'PENDING') return 'pending';
  if (s === 'CONTACTED') return 'contacted';
  if (s === 'RESOLVED') return 'active';
  return 'excused';
}

export function CareDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [quickNote, setQuickNote] = useState('');

  const { data: f } = useQuery({
    queryKey: ['follow-up', id],
    queryFn: () => getFollowUp(id!),
    enabled: !!id,
  });

  useEffect(() => {
    setQuickNote('');
  }, [id]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['follow-ups'] });
    qc.invalidateQueries({ queryKey: ['follow-up', id] });
  };

  const statusMut = useMutation({
    mutationFn: (status: string) => updateFollowUp(id!, { status }),
    onSuccess: refresh,
  });

  const noteMut = useMutation({
    mutationFn: () => {
      const stamped = `[${new Date().toISOString().slice(0, 10)}] ${quickNote.trim()}`;
      const merged = f?.notes ? `${f.notes}\n${stamped}` : stamped;
      return updateFollowUp(id!, { notes: merged });
    },
    onSuccess: () => {
      setQuickNote('');
      refresh();
    },
  });

  if (!id) return null;
  const s = f ? subjectOf(f) : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A2E]/40" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-bg-card shadow-modal z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-text-secondary/60">Member Care Timeline</span>
              <h2 className="text-lg font-semibold text-text-primary">{s?.name ?? 'Loading...'}</h2>
            </div>
            <button onClick={onClose} className="text-text-secondary/60 hover:text-text-primary p-1">
              <X size={24} />
            </button>
          </div>

          {f && (
            <>
              <div className="bg-bg-base/60 rounded-xl p-4 flex flex-col gap-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Current Trigger</span>
                  <Badge variant={f.reason.toLowerCase().includes('absent') ? 'absent' : 'contacted'}>{f.reason}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Assigned Care Staff</span>
                  <span className="font-semibold">{f.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Phone</span>
                  <span className="font-semibold tabular-nums">{s?.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Status</span>
                  <Badge variant={statusVariant(f.status)}>{statusLabel(f.status)}</Badge>
                </div>
                {f.contactDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Contact By</span>
                    <span className="font-semibold">{f.contactDate}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-text-primary">Care Log</h3>
                <div className="p-4 rounded-xl bg-bg-base text-[13px] leading-relaxed whitespace-pre-wrap">
                  {f.notes || 'No care notes recorded yet.'}
                </div>
                <div className="text-xs text-text-secondary/60">
                  Opened {new Date(f.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' • '}Updated {new Date(f.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="bg-[#EAE7F8]/50 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-[13px] font-semibold text-text-primary">Quick Care Log Append</span>
                <input
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Type quick pastoral note..."
                  className="h-9 px-3 rounded-lg bg-bg-card text-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                />
                <Button size="compact" disabled={!quickNote.trim() || noteMut.isPending} onClick={() => noteMut.mutate()} className="gap-2">
                  <Send size={14} /> {noteMut.isPending ? 'Submitting...' : 'Submit Note'}
                </Button>
              </div>
            </>
          )}
          {!f && <div className="text-sm text-text-secondary">Loading care record...</div>}
        </div>

        {f && (
          <div className="p-4 bg-bg-base/60 flex items-center justify-between gap-2">
            <Button variant="ghost" size="compact" onClick={onClose}>Close</Button>
            <div className="flex items-center gap-2">
              {f.status === 'PENDING' && (
                <Button size="compact" disabled={statusMut.isPending} onClick={() => statusMut.mutate('CONTACTED')}>
                  Mark Contacted
                </Button>
              )}
              {f.status === 'CONTACTED' && (
                <Button size="compact" disabled={statusMut.isPending} onClick={() => statusMut.mutate('RESOLVED')}>
                  Mark Resolved
                </Button>
              )}
              {(f.status === 'PENDING' || f.status === 'CONTACTED') && (
                <Button size="compact" variant="secondary" disabled={statusMut.isPending} onClick={() => statusMut.mutate('CLOSED')}>
                  Close
                </Button>
              )}
              {f.status === 'CLOSED' && (
                <Button size="compact" variant="secondary" disabled={statusMut.isPending} onClick={() => statusMut.mutate('PENDING')}>
                  Reopen
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
