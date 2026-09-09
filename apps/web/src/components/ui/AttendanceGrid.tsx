import { Checkbox } from './Checkbox';

type Props = {
  sundays: string[];
  members: { id: string; name: string; records: (string | null)[] }[];
  onToggle: (memberId: string, sundayIndex: number, checked: boolean) => void;
};

export function AttendanceGrid({ sundays, members, onToggle }: Props) {
  return (
    <div className="overflow-auto border border-border rounded-xl bg-bg-card shadow-card">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-bg-base/50">
          <tr>
            <th className="py-3 px-4 text-left font-medium text-text-secondary sticky left-0 bg-bg-base/50">Member</th>
            {sundays.map((d) => (
              <th key={d} className="py-3 px-4 text-center font-medium text-text-secondary">{new Date(d).toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-bg-base/30">
              <td className="py-3 px-4 font-medium text-text-primary sticky left-0 bg-bg-card">{m.name}</td>
              {m.records.map((r, idx) => (
                <td key={idx} className="py-3 px-4 text-center">
                  <Checkbox
                    checked={r === 'PRESENT'}
                    onChange={(e) => onToggle(m.id, idx, e.target.checked)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
