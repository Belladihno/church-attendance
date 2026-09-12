import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMembers, getMember, getMemberStats, type Member } from '../api/members';
import { getOverview } from '../api/dashboard';
import { detectFollowUps } from '../api/followUps';
import type { MemberFilters } from '../components/members/FilterToolbar';
import type { MemberChip } from '../components/members/MobileMemberChips';

const PAGE_LIMIT = 10;

export function useMembers() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    department: searchParams.get('department') || '',
    churchRole: '',
    status: '',
    gender: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [chip, setChip] = useState<MemberChip>('all');
  const [sheetMember, setSheetMember] = useState<Member | null>(null);

  const workerOnly = chip === 'workers';
  const careOnly = chip === 'care';

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.department, filters.churchRole, filters.status, filters.gender, chip]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.department ? { department: filters.department } : {}),
      ...(filters.gender ? { gender: filters.gender } : {}),
      ...(filters.churchRole ? { churchRole: filters.churchRole } : {}),
      ...(workerOnly ? { isWorker: 'true' } : {}),
    }),
    [page, debouncedSearch, filters.status, filters.department, filters.gender, filters.churchRole, workerOnly],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['members', queryParams],
    queryFn: () => getMembers(queryParams),
  });

  const { data: stats } = useQuery({
    queryKey: ['members-stats'],
    queryFn: getMemberStats,
  });

  // Shared caches with TopBar/dashboard (no extra fetches)
  const { data: overview } = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });
  const { data: detect2 = [] } = useQuery({ queryKey: ['follow-ups-detect-topbar'], queryFn: () => detectFollowUps(2) });

  // Lightweight totals for mobile chips
  const { data: choirCount } = useQuery({
    queryKey: ['members-count', 'CHOIR'],
    queryFn: () => getMembers({ department: 'CHOIR', limit: 1 }),
  });
  const { data: usherCount } = useQuery({
    queryKey: ['members-count', 'USHERING'],
    queryFn: () => getMembers({ department: 'USHERING', limit: 1 }),
  });

  const members = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  // Needs-care list (active members absent 2+ Sundays), client-filtered by search
  const careMembers = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return detect2;
    return detect2.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.phone}`.toLowerCase().includes(q),
    );
  }, [detect2, debouncedSearch]);

  const cardMembers = careOnly ? careMembers : members;

  // Per-member attendance rates (uses existing GET /members/:id which includes rate)
  const rateQueries = useQueries({
    queries: cardMembers.map((m) => ({
      queryKey: ['member-rate', m.id],
      queryFn: () => getMember(m.id),
      select: (d: { attendance?: { rate?: number } }) => d.attendance?.rate ?? null,
      staleTime: 60_000,
    })),
  });
  const ratesLoading = rateQueries.some((q) => q.isLoading);
  const rates: Record<string, number | null> = {};
  cardMembers.forEach((m, i) => {
    const q = rateQueries[i];
    rates[m.id] = q?.data ?? null;
  });

  const onChip = (c: MemberChip) => {
    setChip(c);
    if (c === 'CHOIR' || c === 'USHERING') {
      setFilters((f) => ({ ...f, department: c }));
    } else {
      setFilters((f) => (f.department ? { ...f, department: '' } : f));
    }
  };

  const handleFilterChange = (f: MemberFilters) => {
    setFilters(f);
    if (f.department === 'CHOIR' || f.department === 'USHERING') setChip(f.department);
    else if (chip === 'CHOIR' || chip === 'USHERING') setChip('all');
  };

  const clearAll = () => {
    setFilters({ search: '', department: '', churchRole: '', status: '', gender: '' });
    setChip('all');
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const all = await getMembers({
        limit: 500,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.department ? { department: filters.department } : {}),
        ...(filters.gender ? { gender: filters.gender } : {}),
        ...(filters.churchRole ? { churchRole: filters.churchRole } : {}),
      });
      const header = 'First Name,Last Name,Phone,Gender,Address,Department,Church Role,Status,Date Joined';
      const rows = all.data.map((m) =>
        [m.firstName, m.lastName, m.phone, m.gender, `"${(m.address || '').replace(/"/g, '""')}"`, m.department, m.churchRole, m.status, m.dateJoined].join(','),
      );
      const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'members-directory.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return {
    page, setPage, filters, modalOpen, setModalOpen, exporting,
    chip, sheetMember, setSheetMember, workerOnly, careOnly,
    data, isLoading, stats, overview, detect2, choirCount, usherCount,
    members, total, totalPages, pageLimit: PAGE_LIMIT,
    careMembers, cardMembers, ratesLoading, rates,
    onChip, handleFilterChange, clearAll, onExport,
  };
}

export type MembersState = ReturnType<typeof useMembers>;
