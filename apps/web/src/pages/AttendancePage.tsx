import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGrid, bulkMark } from '../api/attendance';
import { getMembers } from '../api/members';
import { SubHeader } from '../components/attendance/SubHeader';
import { SummaryStrip } from '../components/attendance/SummaryStrip';
import { GridControls } from '../components/attendance/GridControls';
import { AttendanceMatrix } from '../components/attendance/AttendanceMatrix';

const SYSTEM_START = { year: 2026, month: 9 };

export function AttendancePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [serviceType, setServiceType] = useState('SUNDAY_SERVICE');
  const [search, setSearch] = useState('');
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);
  const [department, setDepartment] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const qc = useQueryClient();

  const isBeforeStart = year < SYSTEM_START.year || (year === SYSTEM_START.year && month < SYSTEM_START.month);

  const { data: grid } = useQuery({
    queryKey: ['attendance-grid', month, year, serviceType, department],
    queryFn: () => getGrid({ month, year, serviceType, department: department || undefined }),
    enabled: !isBeforeStart,
  });

  // Set selected Sunday to most recent past Sunday when grid loads
  useEffect(() => {
    if (grid?.sundays.length && !selectedSunday) {
      const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
      const past = grid.sundays.filter((d) => d <= todayStr);
      setSelectedSunday(past[past.length - 1] ?? grid.sundays[0]);
    }
  }, [grid, selectedSunday]);

  // Reset selected when month/year changes
  useEffect(() => {
    setSelectedSunday(null);
  }, [month, year]);

  const { data: membersData } = useQuery({
    queryKey: ['members', 1, '', '', ''],
    queryFn: () => getMembers({ page: 1, limit: 500 }),
  });

  const total = membersData?.total ?? grid?.members.length ?? 0;

  // Summary for selected Sunday (defaults to most recent past Sunday)
  const summary = useMemo(() => {
    if (!grid || !selectedSunday) return { recorded: 0, present: 0, absent: 0, excused: 0, absentDelta: null as number | null, label: '' };
    const idx = grid.sundays.indexOf(selectedSunday);
    if (idx === -1) return { recorded: 0, present: 0, absent: 0, excused: 0, absentDelta: null, label: selectedSunday };
    let present = 0, absent = 0, excused = 0, recorded = 0;
    for (const m of grid.members) {
      const status = edits[`${m.id}|${selectedSunday}`] ?? m.records[idx];
      if (status === 'PRESENT') { present++; recorded++; }
      else if (status === 'ABSENT') { absent++; recorded++; }
      else if (status === 'EXCUSED') { excused++; recorded++; }
    }
    // delta vs previous Sunday
    let absentDelta: number | null = null;
    const dNow = new Date();
    const todayStr = `${dNow.getFullYear()}-${String(dNow.getMonth() + 1).padStart(2, '0')}-${String(dNow.getDate()).padStart(2, '0')}`;
    const pastSundays = grid.sundays.filter((d) => d <= todayStr);
    const selIdx = pastSundays.indexOf(selectedSunday);
    if (selIdx > 0) {
      const prev = pastSundays[selIdx - 1];
      const prevIdx = grid.sundays.indexOf(prev);
      let absentPrev = 0;
      for (const m of grid.members) {
        const prevStatus = edits[`${m.id}|${prev}`] ?? m.records[prevIdx];
        if (prevStatus === 'ABSENT') absentPrev++;
      }
      absentDelta = absent - absentPrev;
    }
    const label = new Date(selectedSunday).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    return { recorded, present, absent, excused, absentDelta, label };
  }, [grid, selectedSunday, edits]);

  const filteredMembers = useMemo(() => {
    if (!grid) return [];
    const q = search.toLowerCase().trim();
    const mapMember = (m: any) => {
      const [first, last] = m.name.split(' ');
      return { ...m, firstName: first || m.name, lastName: last || '', dateJoined: m.dateJoined };
    };
    if (!q) return grid.members.map(mapMember);
    return grid.members.filter((m) => m.name.toLowerCase().includes(q)).map(mapMember);
  }, [grid, search]);

  const mut = useMutation({
    mutationFn: async () => {
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
    onSuccess: () => {
      setEdits({});
      qc.invalidateQueries({ queryKey: ['attendance-grid'] });
    },
  });

  const onToggle = (memberId: string, sunday: string, current: string | null) => {
    const next = current === 'PRESENT' ? 'ABSENT' : current === 'ABSENT' ? 'EXCUSED' : 'PRESENT';
    setEdits((prev) => ({ ...prev, [`${memberId}|${sunday}`]: next }));
  };

  const onBulkPresent = () => {
    if (!grid || grid.sundays.length === 0) return;
    const dNow2 = new Date();
    const todayStr = `${dNow2.getFullYear()}-${String(dNow2.getMonth() + 1).padStart(2, '0')}-${String(dNow2.getDate()).padStart(2, '0')}`;
    // most recent Sunday <= today
    const pastSundays = grid.sundays.filter((d) => d <= todayStr);
    const target = pastSundays[pastSundays.length - 1] ?? grid.sundays[0];
    if (target > todayStr) return;
    const next: Record<string, string> = { ...edits };
    for (const m of filteredMembers) {
      next[`${m.id}|${target}`] = 'PRESENT';
    }
    setEdits(next);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6">
      <SubHeader month={month} year={year} serviceType={serviceType} onServiceChange={setServiceType} />
      <SummaryStrip total={total} recorded={summary.recorded} present={summary.present} absent={summary.absent} excused={summary.excused} absentDelta={summary.absentDelta} label={summary.label} />
      <GridControls
        monthLabel={monthLabel}
        onPrev={() => {
          if (isBeforeStart) return;
          const d = new Date(year, month - 2, 1);
          if (d.getFullYear() < SYSTEM_START.year || (d.getFullYear() === SYSTEM_START.year && d.getMonth() + 1 < SYSTEM_START.month)) return;
          setMonth(d.getMonth() + 1);
          setYear(d.getFullYear());
        }}
        onNext={() => {
          const d = new Date(year, month, 1);
          setMonth(d.getMonth() + 1);
          setYear(d.getFullYear());
        }}
        search={search}
        onSearch={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        onBulkPresent={onBulkPresent}
        onSave={() => mut.mutate()}
        pending={Object.keys(edits).length}
        saving={mut.isPending}
      />
      {isBeforeStart ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <div className="text-text-secondary">No records before September 2026</div>
          <div className="text-xs text-text-secondary/60 mt-1">Attendance tracking starts from September 2026</div>
        </div>
      ) : grid ? (
        <AttendanceMatrix sundays={grid.sundays} members={filteredMembers} edits={edits} onToggle={onToggle} selectedSunday={selectedSunday} onSelectSunday={setSelectedSunday} />
      ) : (
        <div className="text-center p-8 text-text-secondary">Loading grid...</div>
      )}
    </div>
  );
}
