import { useState, useMemo } from 'react';
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
  const [department, setDepartment] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const qc = useQueryClient();

  const isBeforeStart = year < SYSTEM_START.year || (year === SYSTEM_START.year && month < SYSTEM_START.month);

  const { data: grid } = useQuery({
    queryKey: ['attendance-grid', month, year, serviceType, department],
    queryFn: () => getGrid({ month, year, serviceType, department: department || undefined }),
    enabled: !isBeforeStart,
  });

  const { data: membersData } = useQuery({
    queryKey: ['members', 1, '', '', ''],
    queryFn: () => getMembers({ page: 1, limit: 500 }),
  });

  const total = membersData?.total ?? grid?.members.length ?? 0;

  // Summary derived from grid — today vs last week
  const summary = useMemo(() => {
    if (!grid || grid.sundays.length === 0) return { recorded: 0, present: 0, absent: 0, excused: 0, absentDelta: null as number | null };
    let present = 0, absent = 0, excused = 0, recorded = 0;
    for (const m of grid.members) {
      for (const r of m.records) {
        if (r === 'PRESENT') { present++; recorded++; }
        else if (r === 'ABSENT') { absent++; recorded++; }
        else if (r === 'EXCUSED') { excused++; recorded++; }
      }
    }
    for (const v of Object.values(edits)) {
      if (v === 'PRESENT') present++;
      else if (v === 'ABSENT') absent++;
      else if (v === 'EXCUSED') excused++;
    }

    // delta: most recent past Sunday vs previous
    const dNow = new Date();
    const todayStr = `${dNow.getFullYear()}-${String(dNow.getMonth() + 1).padStart(2, '0')}-${String(dNow.getDate()).padStart(2, '0')}`;
    const pastSundays = grid.sundays.filter((d) => d <= todayStr);
    let absentDelta: number | null = null;
    if (pastSundays.length >= 2) {
      const last = pastSundays[pastSundays.length - 1];
      const prev = pastSundays[pastSundays.length - 2];
      const lastIdx = grid.sundays.indexOf(last);
      const prevIdx = grid.sundays.indexOf(prev);
      let absentToday = 0, absentPrev = 0;
      for (const m of grid.members) {
        const todayStatus = edits[`${m.id}|${last}`] ?? m.records[lastIdx];
        const prevStatus = edits[`${m.id}|${prev}`] ?? m.records[prevIdx];
        if (todayStatus === 'ABSENT') absentToday++;
        if (prevStatus === 'ABSENT') absentPrev++;
      }
      absentDelta = absentToday - absentPrev;
    }
    return { recorded, present, absent, excused, absentDelta };
  }, [grid, edits]);

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
      <SummaryStrip total={total} recorded={summary.recorded} present={summary.present} absent={summary.absent} excused={summary.excused} absentDelta={summary.absentDelta} />
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
        <AttendanceMatrix sundays={grid.sundays} members={filteredMembers} edits={edits} onToggle={onToggle} />
      ) : (
        <div className="text-center p-8 text-text-secondary">Loading grid...</div>
      )}
    </div>
  );
}
