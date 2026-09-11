import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

type MemberRow = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  records: (string | null)[];
};

type Props = {
  sundays: string[];
  members: MemberRow[];
  edits: Record<string, string>;
  onToggle: (memberId: string, sunday: string, current: string | null) => void;
  selectedSunday?: string | null;
  onSelectSunday?: (date: string) => void;
};

function StatusBadge({ status, isEdited, isFuture }: { status: string | null; isEdited: boolean; isFuture?: boolean }) {
  if (isFuture) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#F6F1FF] text-text-secondary text-xs">—</span>;
  if (status === null) return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#F6F1FF] text-text-secondary text-xs ${isEdited ? 'ring-2 ring-brand-purple' : ''}`}>—</span>;
  const normalized = status.toUpperCase();
  if (normalized === 'PRESENT') return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md bg-present-bg text-present text-xs font-medium ${isEdited ? 'ring-2 ring-brand-purple' : ''}`}>✓ Present</span>;
  if (normalized === 'EXCUSED') return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#EEECF7] text-[#5A5480] text-xs font-medium ${isEdited ? 'ring-2 ring-brand-purple' : ''}`}>— Excused</span>;
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md bg-absent-bg text-absent text-xs font-medium ${isEdited ? 'ring-2 ring-brand-purple' : ''}`}>✕ Absent</span>;
}

export function AttendanceMatrix({ sundays, members, edits, onToggle, selectedSunday, onSelectSunday }: Props) {
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (members.length === 0) {
    return <div className="bg-bg-card rounded-xl p-8 text-center text-sm text-text-secondary">No members found</div>;
  }

  return (
    <div className="bg-bg-card rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-text-primary border-collapse">
          <thead>
            <tr className="bg-[#F6F1FF] text-text-secondary text-xs font-medium">
              <th className="sticky left-0 z-10 bg-[#F6F1FF] py-3 px-4 min-w-[280px]">Member Profile & Role</th>
              {sundays.map((d) => {
                const isToday = d === todayStr;
                const isFuture = d > todayStr;
                const isSelected = d === selectedSunday;
                const label = isToday ? 'Today' : isFuture ? 'Future' : 'Past';
                return (
                  <th
                    key={d}
                    onClick={() => !isFuture && onSelectSunday?.(d)}
                    className={`py-3 px-3 text-center min-w-[110px] cursor-pointer ${isToday ? 'bg-[#EAE7F8]/60 text-brand-purple' : isFuture ? 'opacity-60' : ''} ${isSelected ? 'ring-2 ring-brand-purple' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] uppercase tracking-wider">{label}</span>
                      <span className="text-sm font-semibold">{new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                  </th>
                );
              })}
              <th className="py-3 px-3 text-center min-w-[90px]">Ratio</th>
              <th className="py-3 px-3 text-center min-w-[110px]">Consistency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {members.map((m) => {
              const presentCount = m.records.filter((r) => r === 'PRESENT').length;
              const total = m.records.length;
              const pct = total ? Math.round((presentCount / total) * 100) : 0;
              return (
                <tr key={m.id} className="hover:bg-[#F9FAFB]">
                  <td className="sticky left-0 z-10 bg-bg-card py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={m.firstName} lastName={m.lastName} size={36} />
                      <div>
                        <div className="font-semibold text-text-primary">{m.name}</div>
                        <div className="text-xs text-text-secondary">Member</div>
                      </div>
                    </div>
                  </td>
                  {sundays.map((d, sIdx) => {
                    const key = `${m.id}|${d}`;
                    const status = edits[key] ?? m.records[sIdx];
                    const isEdited = key in edits;
                    const isFuture = d > todayStr;
                    const isBeforeJoined = d < m.dateJoined;
                    const isDisabled = isFuture || isBeforeJoined;
                    const isTodayCell = d === todayStr;
                    return (
                      <td key={d} className={`py-2 px-3 text-center ${isTodayCell ? 'bg-[#EAE7F8]/20' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
                        <button
                          onClick={() => !isDisabled && onToggle(m.id, d, status)}
                          disabled={isDisabled}
                          className="relative disabled:cursor-not-allowed"
                          title={isBeforeJoined ? `Before joined (${m.dateJoined})` : isFuture ? 'Future Sunday — not yet' : undefined}
                        >
                          <StatusBadge status={status} isEdited={isEdited} isFuture={isDisabled} />
                          {isEdited && !isDisabled && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-purple rounded-full" title="Unsaved edit" />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center font-semibold">{presentCount}/{total}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={pct >= 80 ? 'present' : pct >= 60 ? 'pending' : 'absent'}>{pct}%</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-[#F6F1FF]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-primary">Quick Toggle Guide:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-present-bg text-present text-xs">✓ Present</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-absent-bg text-absent text-xs">✕ Absent</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEECF7] text-[#5A5480] text-xs">— Excused</span>
        </div>
        <span>Click any cell to cycle status (Present → Absent → Excused)</span>
      </div>
    </div>
  );
}
