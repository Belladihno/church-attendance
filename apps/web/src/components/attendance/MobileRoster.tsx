import { NotebookPen } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { departmentLabel, churchRoleLabel } from '../members/labels';

export type RosterMember = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  records: (string | null)[];
};

export type RosterMeta = {
  department?: string | null;
  churchRole?: string;
  notes?: string | null;
};

const dotColor: Record<string, string> = {
  PRESENT: 'bg-brand-green',
  ABSENT: 'bg-brand-red',
  EXCUSED: 'bg-slate-400',
};

function StatusDot({ status }: { status: string | null }) {
  const color = status ? dotColor[status] ?? 'bg-border' : 'bg-border';
  return <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${color} ring-2 ring-white`} />;
}

function SegButton({
  active,
  activeCls,
  onClick,
  label,
  title,
}: {
  active: boolean;
  activeCls: string;
  onClick: () => void;
  label: string;
  title: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      aria-label={title}
      className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-[12px] transition-all ${
        active ? `${activeCls} text-white shadow-sm` : 'text-text-secondary'
      }`}
    >
      {label}
    </button>
  );
}

type Props = {
  sundays: string[];
  sundayIndex: number;
  selectedSunday: string;
  members: RosterMember[];
  edits: Record<string, string>;
  meta: Map<string, RosterMeta>;
  todayStr: string;
  expandedId: string | null;
  onExpand: (id: string | null) => void;
  onMark: (memberId: string, status: string) => void;
  onNote: (m: RosterMember) => void;
};

export function MobileRoster({
  sundays,
  sundayIndex,
  selectedSunday,
  members,
  edits,
  meta,
  todayStr,
  expandedId,
  onExpand,
  onMark,
  onNote,
}: Props) {
  if (members.length === 0) {
    return <div className="bg-white rounded-2xl p-8 text-center text-sm text-text-secondary">No members found</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-border/80 shadow-card divide-y divide-border/60 overflow-hidden">
      {members.map((m) => {
        const key = `${m.id}|${selectedSunday}`;
        const status = edits[key] ?? (sundayIndex >= 0 ? m.records[sundayIndex] : null) ?? null;
        const info = meta.get(m.id);
        const deptRole = info?.department || info?.churchRole
          ? `${info?.department ? departmentLabel(info.department) : 'Congregation'} · ${info?.churchRole ? churchRoleLabel(info.churchRole) : 'Member'}`
          : 'Member';
        const expanded = expandedId === m.id;
        const pastSundays = sundays.filter((d) => d <= todayStr);

        return (
          <div key={m.id}>
            <div className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 min-h-[64px]">
              <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => onExpand(expanded ? null : m.id)}>
                <div className="relative shrink-0">
                  <Avatar firstName={m.firstName} lastName={m.lastName} size={40} />
                  <StatusDot status={status} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14px] text-text-primary tracking-tight truncate leading-snug">{m.name}</span>
                  <div className="flex items-center gap-1.5 text-[12px] text-text-secondary leading-none mt-0.5">
                    <span className="truncate">{deptRole}</span>
                    <span className="text-[10px] text-border">●</span>
                    {info?.notes ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onNote(m); }}
                        className="text-brand-purple text-[11px] flex items-center gap-0.5"
                        title="Has remark"
                      >
                        <NotebookPen size={13} />
                        <span className="text-[10px] bg-[#EAE7F8] px-1 rounded font-semibold">Remark</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); onNote(m); }}
                        className="text-text-secondary/50 hover:text-brand-purple text-[11px] flex items-center"
                        title="Add pastoral remark"
                      >
                        <NotebookPen size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-bg-base p-0.5 rounded-lg border border-border/60 shrink-0" role="group" aria-label={`Mark ${m.name}`}>
                <SegButton active={status === 'PRESENT'} activeCls="bg-brand-green" onClick={() => onMark(m.id, 'PRESENT')} label="P" title="Mark Present" />
                <SegButton active={status === 'ABSENT'} activeCls="bg-brand-red" onClick={() => onMark(m.id, 'ABSENT')} label="A" title="Mark Absent" />
                <SegButton active={status === 'EXCUSED'} activeCls="bg-slate-600" onClick={() => onMark(m.id, 'EXCUSED')} label="E" title="Mark Excused" />
              </div>
            </div>
            {expanded && (
              <div className="px-4 py-2.5 bg-bg-base/70 border-t border-border/40 flex items-center justify-between text-[11px] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-text-secondary font-medium shrink-0">Sundays this month:</span>
                  <div className="flex items-center gap-1.5">
                    {pastSundays.map((d) => {
                      const idx = sundays.indexOf(d);
                      const s = edits[`${m.id}|${d}`] ?? m.records[idx] ?? null;
                      return (
                        <span
                          key={d}
                          title={`${d}: ${s ?? 'not recorded'}`}
                          className={`w-2 h-2 rounded-full ${s ? dotColor[s] ?? 'bg-border' : 'bg-border'}`}
                        />
                      );
                    })}
                  </div>
                  {info?.notes && <span className="text-text-secondary truncate italic">“{info.notes.slice(0, 60)}{info.notes.length > 60 ? '…' : ''}”</span>}
                </div>
                <button onClick={() => onNote(m)} className="text-brand-purple font-semibold hover:underline shrink-0">
                  {info?.notes ? 'Edit' : 'Pastoral note'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
