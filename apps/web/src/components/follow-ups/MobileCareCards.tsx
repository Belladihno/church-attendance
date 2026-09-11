import { Phone, MessageCircle, SearchX, CheckCircle } from 'lucide-react';
import type { FollowUp } from '../../api/followUps';
import { subjectOf, subjectInitials, statusLabel, waLink } from './labels';

const dotColor: Record<FollowUp['status'], string> = {
  PENDING: 'bg-pending',
  CONTACTED: 'bg-contacted',
  RESOLVED: 'bg-brand-green',
  CLOSED: 'bg-text-secondary/40',
};

function StreakPill({ f, absent2, absent3 }: { f: FollowUp; absent2: Set<string>; absent3: Set<string> }) {
  if (f.memberId && absent3.has(f.memberId)) {
    return <span className="px-2.5 py-1 rounded-full bg-absent-bg text-absent text-[11px] font-semibold whitespace-nowrap shrink-0">Absent 3+ Sundays</span>;
  }
  if (f.memberId && absent2.has(f.memberId)) {
    return <span className="px-2.5 py-1 rounded-full bg-pending-bg text-pending text-[11px] font-semibold whitespace-nowrap shrink-0">Absent 2 Sundays</span>;
  }
  return <span className="px-2.5 py-1 rounded-full bg-bg-base text-text-secondary text-[11px] font-semibold whitespace-nowrap shrink-0">{statusLabel(f.status)}</span>;
}

type Props = {
  tickets: FollowUp[];
  absent2: Set<string>;
  absent3: Set<string>;
  busyId: string | null;
  onStatus: (id: string, status: FollowUp['status']) => void;
  onNote: (f: FollowUp) => void;
  onOpen: (f: FollowUp) => void;
  onClear: () => void;
};

export function MobileCareCards({ tickets, absent2, absent3, busyId, onStatus, onNote, onOpen, onClear }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-border/40">
        <div className="w-12 h-12 rounded-full bg-[#EAE7F8] flex items-center justify-center mb-2.5 text-brand-purple">
          <SearchX size={24} />
        </div>
        <h4 className="text-[15px] font-semibold text-text-primary mb-1">No care records found</h4>
        <p className="text-[12px] text-text-secondary max-w-xs">Try another keyword or reset the filters to view all records.</p>
        <button onClick={onClear} className="mt-3 text-sm text-brand-purple font-medium hover:underline">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {tickets.map((f) => {
        const s = subjectOf(f);
        return (
          <div key={f.id} className="bg-white rounded-2xl p-4 border border-border/70 shadow-card flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => onOpen(f)}>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-[#EAE7F8] text-brand-purple font-bold flex items-center justify-center text-sm">
                    {subjectInitials(s.name)}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${dotColor[f.status]} ring-2 ring-white`} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-text-primary truncate leading-tight">{s.name}</h2>
                  <span className="text-[12px] text-text-secondary mt-0.5 block tabular-nums">{s.phone}</span>
                </div>
              </div>
              <StreakPill f={f} absent2={absent2} absent3={absent3} />
            </div>
            <div className="flex items-center justify-between text-[12px] text-text-secondary pt-0.5">
              <span>
                Assigned: <strong className="text-text-primary font-medium">{f.assignedTo || 'Unassigned'}</strong>
              </span>
              {f.status === 'PENDING' && (
                <span className="text-[11px] text-pending bg-pending-bg/80 px-2 py-0.5 rounded-md font-medium">Visit pending</span>
              )}
              {f.status === 'CONTACTED' && (
                <span className="text-[11px] text-contacted bg-contacted-bg px-2 py-0.5 rounded-md font-medium">In contact</span>
              )}
            </div>
            {f.notes && (
              <div className="px-2.5 py-1.5 rounded-lg bg-bg-base/60 border border-border/40 flex items-center gap-2 text-[12px] text-text-secondary">
                <p className="truncate italic">{f.notes}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${s.phone}`}
                  aria-label={`Call ${s.name}`}
                  className="h-8 px-3 rounded-lg bg-[#EAE7F8] text-brand-purple font-semibold text-[12px] flex items-center gap-1.5 active:scale-95"
                >
                  <Phone size={15} />
                  <span>Call</span>
                </a>
                <a
                  href={waLink(s.phone)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp ${s.name}`}
                  className="h-8 px-3 rounded-lg bg-present-bg text-present font-semibold text-[12px] flex items-center gap-1.5 active:scale-95"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
              {f.status === 'PENDING' && (
                <button
                  disabled={busyId === f.id}
                  onClick={() => onStatus(f.id, 'CONTACTED')}
                  className="text-[12px] font-semibold text-contacted bg-contacted-bg/70 px-2.5 py-1 rounded-lg flex items-center gap-1 disabled:opacity-50"
                >
                  <CheckCircle size={15} />
                  <span>Mark done</span>
                </button>
              )}
              {f.status === 'CONTACTED' && (
                <button
                  disabled={busyId === f.id}
                  onClick={() => onStatus(f.id, 'RESOLVED')}
                  className="text-[12px] font-semibold text-present bg-present-bg px-2.5 py-1 rounded-lg disabled:opacity-50"
                >
                  Resolve
                </button>
              )}
              {(f.status === 'RESOLVED' || f.status === 'CLOSED') && (
                <button onClick={() => onNote(f)} className="text-[12px] font-semibold text-brand-purple px-2 py-1">
                  Add note
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
