import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGrid, bulkMark } from '../api/attendance';
import { PageHeader } from '../components/ui/PageHeader';
import { AttendanceGrid } from '../components/ui/AttendanceGrid';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

export function AttendancePage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [serviceType, setServiceType] = useState('SUNDAY_SERVICE');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-grid', month, year, serviceType],
    queryFn: () => getGrid({ month, year, serviceType }),
  });

  const mut = useMutation({
    mutationFn: async () => {
      // group edits by date
      const byDate: Record<string, { memberId: string; status: string }[]> = {};
      for (const [key, status] of Object.entries(edits)) {
        const [memberId, date] = key.split('|');
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push({ memberId, status });
      }
      for (const [date, records] of Object.entries(byDate)) {
        // eslint-disable-next-line no-await-in-loop
        await bulkMark({ date, serviceType, records });
      }
    },
    onSuccess: () => { setEdits({}); qc.invalidateQueries({ queryKey: ['attendance-grid'] }); },
  });

  const onToggle = (memberId: string, idx: number, checked: boolean) => {
    const date = data?.sundays[idx] ?? '';
    if (!date) return;
    setEdits((prev) => ({ ...prev, [`${memberId}|${date}`]: checked ? 'PRESENT' : 'ABSENT' }));
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Member × Sunday matrix"
        actions={<Button onClick={() => mut.mutate()} disabled={mut.isPending || Object.keys(edits).length === 0}>{mut.isPending ? 'Saving...' : 'Save session'}</Button>}
      />
      <div className="flex gap-3 mb-4">
        <Select value={String(month)} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        </Select>
        <Select value={String(year)} onChange={(e) => setYear(Number(e.target.value))}>
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </Select>
        <Select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option value="SUNDAY_SERVICE">Sunday Service</option>
          <option value="SUNDAY_SCHOOL">Sunday School</option>
        </Select>
      </div>

      {isLoading ? <div className="text-center p-8">Loading grid...</div> : data ? <AttendanceGrid sundays={data.sundays} members={data.members} onToggle={onToggle} /> : null}
    </div>
  );
}
