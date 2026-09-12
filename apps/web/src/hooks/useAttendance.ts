import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGrid, bulkMark } from '../api/attendance';
import { getMembers } from '../api/members';
import { toISODate } from '../utils/dates';
import { departmentLabel, churchRoleLabel } from '../components/members/labels';
import type { RosterMember } from '../components/attendance/MobileRoster';

const SYSTEM_START = { year: 2026, month: 9 };

export function useAttendance() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [serviceType, setServiceType] = useState('SUNDAY_SERVICE');
  const [search, setSearch] = useState('');
  const [selectedSundayOverride, setSelectedSundayOverride] = useState<string | null>(null);
  const [lastMonthYear, setLastMonthYear] = useState({ month, year });
  const [department, setDepartment] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteMember, setNoteMember] = useState<RosterMember | null>(null);
  const [rosterVisible, setRosterVisible] = useState(25);
  const qc = useQueryClient();

  const isBeforeStart =
    year < SYSTEM_START.year ||
    (year === SYSTEM_START.year && month < SYSTEM_START.month);

  const { data: grid, error: gridError, refetch: refetchGrid } = useQuery({
    queryKey: ['attendance-grid', month, year, serviceType, department],
    queryFn: () =>
      getGrid({ month, year, serviceType, department: department || undefined }),
    enabled: !isBeforeStart,
  });

  // Reset override when month/year changes (render-phase adjustment)
  if (lastMonthYear.month !== month || lastMonthYear.year !== year) {
    setLastMonthYear({ month, year });
    setSelectedSundayOverride(null);
  }

  // Derive synchronously so cached grid paints the roster on the first pass
  const selectedSunday = useMemo(() => {
    if (selectedSundayOverride) return selectedSundayOverride;
    if (!grid?.sundays.length) return null;
    const past = grid.sundays.filter((s) => s <= toISODate(new Date()));
    return past[past.length - 1] ?? grid.sundays[0];
  }, [grid, selectedSundayOverride]);

  const setSelectedSunday = (val: string | null) => setSelectedSundayOverride(val);

  // Reset roster paging when the list changes
  useEffect(() => {
    setRosterVisible(25);
  }, [search, department, serviceType, grid]);

  const { data: membersData } = useQuery({
    queryKey: ['members', 1, '', '', ''],
    queryFn: () => getMembers({ page: 1, limit: 500 }),
  });

  const total = membersData?.total ?? grid?.members.length ?? 0;

  const summary = useMemo(() => {
    if (!grid || !selectedSunday)
      return { recorded: 0, present: 0, absent: 0, excused: 0, absentDelta: null as number | null, label: '' };
    const idx = grid.sundays.indexOf(selectedSunday);
    if (idx === -1)
      return { recorded: 0, present: 0, absent: 0, excused: 0, absentDelta: null, label: selectedSunday };
    let present = 0, absent = 0, excused = 0, recorded = 0;
    for (const m of grid.members) {
      const status = edits[`${m.id}|${selectedSunday}`] ?? m.records[idx];
      if (status === 'PRESENT') { present++; recorded++; }
      else if (status === 'ABSENT') { absent++; recorded++; }
      else if (status === 'EXCUSED') { excused++; recorded++; }
    }
    let absentDelta: number | null = null;
    const todayStr = toISODate(new Date());
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
    const label = new Date(selectedSunday).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
    });
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
    const next =
      current === 'PRESENT' ? 'ABSENT' : current === 'ABSENT' ? 'EXCUSED' : 'PRESENT';
    setEdits((prev) => ({ ...prev, [`${memberId}|${sunday}`]: next }));
  };

  const onBulkPresent = () => {
    if (!grid || grid.sundays.length === 0) return;
    const todayStr = toISODate(new Date());
    const pastSundays = grid.sundays.filter((d) => d <= todayStr);
    const target = pastSundays[pastSundays.length - 1] ?? grid.sundays[0];
    if (target > todayStr) return;
    const next: Record<string, string> = { ...edits };
    for (const m of filteredMembers) {
      next[`${m.id}|${target}`] = 'PRESENT';
    }
    setEdits(next);
  };

  const onPrevMonth = () => {
    if (isBeforeStart) return;
    const d = new Date(year, month - 2, 1);
    if (d.getFullYear() < SYSTEM_START.year || (d.getFullYear() === SYSTEM_START.year && d.getMonth() + 1 < SYSTEM_START.month)) return;
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
  };

  const onNextMonth = () => {
    const d = new Date(year, month, 1);
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });

  const mobileTodayStr = toISODate(new Date());
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
      if (m.department && m.department !== 'NONE')
        counts[m.department] = (counts[m.department] ?? 0) + 1;
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
  const noteDeptRole =
    noteMeta?.department || noteMeta?.churchRole
      ? `${noteMeta?.department ? departmentLabel(noteMeta.department) : 'Congregation'} · ${noteMeta?.churchRole ? churchRoleLabel(noteMeta.churchRole) : 'Member'}`
      : undefined;

  return {
    month, year, serviceType, setServiceType, search, setSearch,
    department, setDepartment, edits, expandedId, setExpandedId,
    noteMember, setNoteMember, rosterVisible, setRosterVisible,
    isBeforeStart, grid, gridError, refetchGrid, selectedSunday, setSelectedSunday,
    membersData, total, summary, filteredMembers, mut,
    onToggle, onBulkPresent, onPrevMonth, onNextMonth, monthLabel,
    mobileTodayStr, sundayIndex, memberMeta, deptCounts,
    onMark, onMarkRest, noteMeta, noteDeptRole,
  };
}

export type AttendanceState = ReturnType<typeof useAttendance>;
