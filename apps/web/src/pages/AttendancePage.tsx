import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGrid, bulkMark } from '../api/attendance';
import { getMembers } from '../api/members';
import { SubHeader } from '../components/attendance/SubHeader';
import { SummaryStrip } from '../components/attendance/SummaryStrip';
import { GridControls } from '../components/attendance/GridControls';
import { AttendanceMatrix } from '../components/attendance/AttendanceMatrix';
import { MobileSessionCard } from '../components/attendance/MobileSessionCard';
import { MobileMetricStrip } from '../components/attendance/MobileMetricStrip';
import { MobileSearchChips } from '../components/attendance/MobileSearchChips';
import { MobileRoster, type RosterMember } from '../components/attendance/MobileRoster';
import { MobileNoteSheet } from '../components/attendance/MobileNoteSheet';
import { MobileSyncBar } from '../components/attendance/MobileSyncBar';
import { departmentLabel, churchRoleLabel } from '../components/members/labels';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteMember, setNoteMember] = useState<RosterMember | null>(null);
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

  // ---- Mobile fast-marking helpers (roster targets selectedSunday only) ----
  const dToday = new Date();
  const mobileTodayStr = `${dToday.getFullYear()}-${String(dToday.getMonth() + 1).padStart(2, '0')}-${String(dToday.getDate()).padStart(2, '0')}`;
  const sundayIndex = grid && selectedSunday ? grid.sundays.indexOf(selectedSunday) : -1;

  const memberMeta = useMemo(() => {
    const map = new Map<string, { department?: string | null; churchRole?: string; notes?: string | null }>();
    for (const m of membersData?.data ?? []) {
      map.set(m.id, { department: m.department, churchRole: m.churchRole, notes: m.notes });
    }
    return map;
  }, [membersData]);

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of membersData?.data ?? []) {
      if (m.department && m.department !== 'NONE') counts[m.department] = (counts[m.department] ?? 0) + 1;
    }
    return counts;
  }, [membersData]);

  const onMark = (memberId: string, status: string) => {
    if (!selectedSunday) return;
    setEdits((prev) => ({ ...prev, [`${memberId}|${selectedSunday}`]: status }));
  };

  const onMarkRest = () => {
    if (!grid || !selectedSunday || sundayIndex < 0 || selectedSunday > mobileTodayStr) return;
    const next: Record<string, string> = { ...edits };
    for (const m of filteredMembers) {
      const key = `${m.id}|${selectedSunday}`;
      const cur = next[key] ?? m.records[sundayIndex];
      if (!cur) next[key] = 'PRESENT';
    }
    setEdits(next);
  };

  const noteMeta = noteMember ? memberMeta.get(noteMember.id) : undefined;
  const noteDeptRole = noteMeta?.department || noteMeta?.churchRole
    ? `${noteMeta?.department ? departmentLabel(noteMeta.department) : 'Congregation'} · ${noteMeta?.churchRole ? churchRoleLabel(noteMeta.churchRole) : 'Member'}`
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile fast-marking layout */}
      <div className="md:hidden flex flex-col gap-3.5 max-w-lg mx-auto w-full">
        <MobileSessionCard selectedSunday={selectedSunday} serviceType={serviceType} onServiceChange={setServiceType} />
        <MobileMetricStrip total={total} recorded={summary.recorded} present={summary.present} absent={summary.absent} excused={summary.excused} />
        <MobileSearchChips
          search={search}
          onSearch={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          counts={deptCounts}
          total={membersData?.total ?? 0}
        />
        {isBeforeStart ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card">
            <div className="text-text-secondary">No records before September 2026</div>
            <div className="text-xs text-text-secondary/60 mt-1">Attendance tracking starts from September 2026</div>
          </div>
        ) : grid && selectedSunday ? (
          <MobileRoster
            sundays={grid.sundays}
            sundayIndex={sundayIndex}
            selectedSunday={selectedSunday}
            members={filteredMembers}
            edits={edits}
            meta={memberMeta}
            todayStr={mobileTodayStr}
            expandedId={expandedId}
            onExpand={setExpandedId}
            onMark={onMark}
            onNote={setNoteMember}
          />
        ) : (
          <div className="text-center p-8 text-text-secondary">Loading roster...</div>
        )}
      </div>
      {grid && selectedSunday && !isBeforeStart && (
        <MobileSyncBar pending={Object.keys(edits).length} saving={mut.isPending} onMarkRest={onMarkRest} onSync={() => mut.mutate()} />
      )}
      <MobileNoteSheet member={noteMember} meta={noteMeta} deptRole={noteDeptRole} onClose={() => setNoteMember(null)} />

      {/* Desktop monthly grid layout */}
      <div className="hidden md:flex flex-col gap-6">
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
    </div>
  );
}
