import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, UserCheck } from 'lucide-react';
import { getFirstTimer, updateFirstTimer, convertToMember, type FirstTimer } from '../../api/firstTimers';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { statusLabel, serviceLabel, formatVisitDate } from './labels';

function statusVariant(s: FirstTimer['followUpStatus']): 'pending' | 'contacted' | 'active' | 'excused' {
  if (s === 'PENDING') return 'pending';
  if (s === 'CONTACTED') return 'contacted';
  if (s === 'CONVERTED') return 'active';
  return 'excused';
}

export function VisitorDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [note, setNote] = useState('');
  const [convertedMemberId, setConvertedMemberId] = useState<string | null>(null);

  const { data: v } = useQuery({
    queryKey: ['first-timer', id],
    queryFn: () => getFirstTimer(id!),
    enabled: !!id,
  });

  useEffect(() => {
    setNote('');
    setConvertedMemberId(null);
  }, [id]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['first-timers'] });
    qc.invalidateQueries({ queryKey: ['first-timer', id] });
  };

  const statusMut = useMutation({
    mutationFn: (status: string) => updateFirstTimer(id!, { followUpStatus: status }),
    onSuccess: refresh,
  });

  const noteMut = useMutation({
    mutationFn: () => {
      const stamped = `[${new Date().toISOString().slice(0, 10)}] ${note.trim()}`;
      const merged = v?.followUpNotes ? `${v.followUpNotes}\n${stamped}` : stamped;
      return updateFirstTimer(id!, { followUpNotes: merged });
    },
    onSuccess: () => {
      setNote('');
      refresh();
    },
  });

  const convertMut = useMutation({
    mutationFn: () => convertToMember(id!),
    onSuccess: (res: { member?: { id: string } }) => {
      setConvertedMemberId(res.member?.id ?? null);
      refresh();
    },
  });

  if (!id) return null;

  const err =
    (statusMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (noteMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (convertMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A2E]/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-0 right-0 h-full w-full max-w-xl bg-bg-card shadow-modal flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-bg-base/60 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {v ? (
              <Avatar firstName={v.firstName} lastName={v.lastName} size={56} />
            ) : (
              <div className="w-14 h-14 rounded-full bg-bg-base" />
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-text-primary">
                  {v ? `${v.firstName} ${v.lastName}` : 'Loading...'}
                </h2>
                {v && <Badge variant={statusVariant(v.followUpStatus)}>{statusLabel(v.followUpStatus)}</Badge>}
              </div>
              {v && (
                <span className="text-[13px] text-text-secondary">
                  {formatVisitDate(v.dateAttended)} — {serviceLabel(v.serviceAttended)}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/50">
            <X size={22} />
          </button>
        </div>

        {v && (
          <div className="p-6 flex flex-col gap-6 flex-1">
            <div className="bg-bg-base/50 rounded-xl p-4 flex flex-col gap-3">
              <span className="text-sm font-semibold text-text-primary">Contact &amp; Visit Details</span>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div><span className="text-text-secondary text-xs block">Mobile Phone</span><span className="font-semibold tabular-nums">{v.phone}</span></div>
                <div><span className="text-text-secondary text-xs block">Gender</span><span className="font-semibold capitalize">{v.gender.toLowerCase()}</span></div>
                <div><span className="text-text-secondary text-xs block">Residential Address</span><span>{v.address || '—'}</span></div>
                <div><span className="text-text-secondary text-xs block">Invited By</span><span className="font-semibold text-brand-purple">{v.invitedBy || 'Walk-in'}</span></div>
                <div><span className="text-text-secondary text-xs block">How Heard</span><span>{v.howHeard || '—'}</span></div>
                <div><span className="text-text-secondary text-xs block">Preferred Service</span><span>{serviceLabel(v.serviceAttended)}</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">Prayer Request &amp; Intake Notes</span>
                <span className="text-xs text-text-secondary/60">Confidential pastoral care</span>
              </div>
              <div className="p-4 rounded-xl bg-bg-base text-[13px] leading-relaxed whitespace-pre-wrap">
                {v.followUpNotes || 'No notes recorded yet.'}
              </div>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a follow-up note (call outcome, visit summary...)"
                className="p-3 rounded-md bg-bg-base border border-border text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 resize-none"
              />
              <div className="flex justify-end">
                <Button size="compact" variant="secondary" disabled={!note.trim() || noteMut.isPending} onClick={() => noteMut.mutate()}>
                  {noteMut.isPending ? 'Saving...' : 'Save Note'}
                </Button>
              </div>
            </div>

            {v.convertedToId && (
              <Link to={`/members/${v.convertedToId}`} className="text-sm text-brand-purple hover:underline">
                View converted member record →
              </Link>
            )}
            {convertedMemberId && (
              <Link to={`/members/${convertedMemberId}`} className="text-sm text-brand-green font-medium">
                Conversion complete — view member record →
              </Link>
            )}
            {err && <div className="text-sm text-brand-red">{err}</div>}
          </div>
        )}

        {v && (
          <div className="p-6 bg-bg-base/60 flex flex-col gap-3">
            {(v.followUpStatus === 'PENDING' || v.followUpStatus === 'CONTACTED') && (
              <Button disabled={convertMut.isPending} onClick={() => convertMut.mutate()} className="gap-2 w-full">
                <UserCheck size={18} />
                {convertMut.isPending ? 'Converting...' : 'Convert to Full Church Member'}
              </Button>
            )}
            <div className="flex items-center gap-2">
              {v.followUpStatus === 'PENDING' && (
                <Button variant="secondary" size="compact" className="flex-1" disabled={statusMut.isPending} onClick={() => statusMut.mutate('CONTACTED')}>
                  Mark Contacted
                </Button>
              )}
              {v.followUpStatus === 'CLOSED' ? (
                <Button variant="secondary" size="compact" className="flex-1" disabled={statusMut.isPending} onClick={() => statusMut.mutate('PENDING')}>
                  Reopen
                </Button>
              ) : (
                v.followUpStatus !== 'CONVERTED' && (
                  <Button variant="ghost" size="compact" className="flex-1" disabled={statusMut.isPending} onClick={() => statusMut.mutate('CLOSED')}>
                    Archive
                  </Button>
                )
              )}
              <Link to={`/first-timers/${v.id}`} className="flex-1">
                <Button variant="ghost" size="compact" className="w-full">Open Full Dossier</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
