import { Phone, BadgeCheck, MessageSquarePlus, Repeat, ChevronRight } from 'lucide-react';
import type { FollowUp } from '../../api/followUps';
import { Badge } from '../ui/Badge';
import { subjectOf, subjectInitials, statusLabel } from './labels';

function statusVariant(s: FollowUp['status']): 'pending' | 'contacted' | 'active' | 'excused' {
  if (s === 'PENDING') return 'pending';
  if (s === 'CONTACTED') return 'contacted';
  if (s === 'RESOLVED') return 'active';
  return 'excused';
}

type Props = {
  followUp: FollowUp;
  onStatus: (id: string, status: FollowUp['status']) => void;
  onNote: (f: FollowUp) => void;
  onReassign: (f: FollowUp) => void;
  onOpen: (f: FollowUp) => void;
  busy: boolean;
};

export function CareCard({ followUp: f, onStatus, onNote, onReassign, onOpen, busy }: Props) {
  const s = subjectOf(f);

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col gap-4 hover:shadow-modal transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#EAE7F8] text-brand-purple font-bold flex items-center justify-center shrink-0">
            {subjectInitials(s.name)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[15px] text-text-primary">{s.name}</span>
              {s.detail && (
                <Badge variant="active" className="whitespace-nowrap">{s.detail}</Badge>
              )}
              <Badge variant={f.reason.toLowerCase().includes('absent') ? 'absent' : 'contacted'} className="whitespace-nowrap">
                {f.reason}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-text-secondary mt-1 flex-wrap">
              <span className="flex items-center gap-1 tabular-nums"><Phone size={15} className="text-text-secondary/60" />{s.phone}</span>
              <span>Assigned to: <strong className="text-text-primary">{f.assignedTo || 'Unassigned'}</strong></span>
              {f.contactDate && <span>Contact by: {f.contactDate}</span>}
            </div>
          </div>
        </div>
        <div className="self-start lg:self-center">
          <Badge variant={statusVariant(f.status)}>{statusLabel(f.status)}</Badge>
        </div>
      </div>

      <div className="bg-bg-base/60 rounded-lg p-3">
        <div className="text-xs font-semibold text-text-primary mb-1">
          {f.assignedTo ? `${f.assignedTo} • Care note` : 'Care note'}
        </div>
        <p className="text-[13px] text-text-secondary whitespace-pre-wrap">{f.notes || 'No care notes recorded yet.'}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {f.status === 'PENDING' && (
            <button
              disabled={busy}
              onClick={() => onStatus(f.id, 'CONTACTED')}
              className="h-8 px-3 rounded-lg bg-contacted-bg hover:bg-contacted-bg/70 text-contacted font-semibold text-[13px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <Phone size={15} /> Mark contacted
            </button>
          )}
          {f.status === 'CONTACTED' && (
            <button
              disabled={busy}
              onClick={() => onStatus(f.id, 'RESOLVED')}
              className="h-8 px-3 rounded-lg bg-present-bg hover:bg-present-bg/70 text-present font-semibold text-[13px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <BadgeCheck size={15} /> Mark resolved
            </button>
          )}
          {(f.status === 'PENDING' || f.status === 'CONTACTED') && (
            <button
              onClick={() => onNote(f)}
              className="h-8 px-3 rounded-lg bg-[#EAE7F8] hover:bg-[#EAE7F8]/70 text-brand-purple font-semibold text-[13px] flex items-center gap-1.5"
            >
              <MessageSquarePlus size={15} /> Add care note
            </button>
          )}
          {f.status !== 'CLOSED' && f.status !== 'RESOLVED' && (
            <button
              onClick={() => onReassign(f)}
              className="h-8 px-3 rounded-lg text-text-secondary hover:bg-bg-base text-[13px] flex items-center gap-1.5"
            >
              <Repeat size={15} /> Reassign
            </button>
          )}
        </div>
        <button onClick={() => onOpen(f)} className="text-[13px] text-brand-purple hover:underline flex items-center gap-1 self-start sm:self-auto">
          View full care log <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
