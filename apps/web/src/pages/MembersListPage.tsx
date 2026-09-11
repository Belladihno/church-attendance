import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { getMembers, getMember, getMemberStats, type Member } from '../api/members';
import { getOverview } from '../api/dashboard';
import { detectFollowUps } from '../api/followUps';
import { MetricRibbon } from '../components/members/MetricRibbon';
import { FilterToolbar, type MemberFilters } from '../components/members/FilterToolbar';
import { MembersTable } from '../components/members/MembersTable';
import { AddMemberModal } from '../components/members/AddMemberModal';
import { MobileStatusBar } from '../components/members/MobileStatusBar';
import { MobileMemberChips, type MemberChip } from '../components/members/MobileMemberChips';
import { MobileMemberCards } from '../components/members/MobileMemberCards';
import { MobileMemberSheet } from '../components/members/MobileMemberSheet';

const PAGE_LIMIT = 10;

export function MembersListPage() {
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

  // Debounce search 300ms
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Reset to page 1 when filters change
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

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-4 max-w-lg mx-auto w-full">
        <MobileStatusBar
          total={stats?.total ?? total}
          consistency={overview ? Math.round(overview.attendanceRate * 10) / 10 : null}
          care={detect2.length}
        />
        <MobileMemberChips
          search={filters.search}
          onSearch={(v) => setFilters({ ...filters, search: v })}
          chip={chip}
          onChip={onChip}
          counts={{
            all: stats?.total ?? total,
            workers: stats?.workers ?? 0,
            choir: choirCount?.total ?? 0,
            ushers: usherCount?.total ?? 0,
            care: detect2.length,
          }}
        />
        {isLoading && !careOnly ? (
          <div className="text-center p-8 text-text-secondary">Loading members...</div>
        ) : (
          <MobileMemberCards
            members={cardMembers}
            rates={rates}
            page={careOnly ? 1 : page}
            totalPages={careOnly ? 1 : totalPages}
            total={careOnly ? cardMembers.length : total}
            onPageChange={setPage}
            onOpen={setSheetMember}
            onClear={clearAll}
          />
        )}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Add new member"
        className="md:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-brand-purple text-white shadow-lg active:scale-95"
      >
        <Plus size={20} />
        <span className="text-[14px] font-semibold tracking-wide pr-0.5">Add member</span>
      </button>
      <MobileMemberSheet
        member={sheetMember}
        rate={sheetMember ? rates[sheetMember.id] ?? null : null}
        onClose={() => setSheetMember(null)}
      />

      {/* Desktop layout */}
      <div className="hidden md:flex flex-col gap-4">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Members Directory</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#EAE7F8] text-brand-purple text-xs font-semibold">
              Parish Roll
            </span>
          </div>
          <p className="text-[13px] text-text-secondary">
            {stats?.total ?? total} registered members
            {stats && stats.departments > 0 ? ` across ${stats.departments} ministry units` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExport}
            disabled={exporting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={17} />
            <span>{exporting ? 'Exporting...' : 'Export Directory (CSV)'}</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card transition-all flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      <MetricRibbon stats={stats} />

      <FilterToolbar
        filters={filters}
        onChange={handleFilterChange}
        shown={members.length}
        total={total}
        active={stats?.active ?? 0}
      />

      {isLoading ? (
        <div className="text-center p-8 text-text-secondary">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <p className="text-sm text-text-secondary">No members match these filters.</p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm text-brand-purple hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <MembersTable
          members={members}
          rates={rates}
          ratesLoading={ratesLoading}
          page={page}
          totalPages={totalPages}
          total={total}
          limit={PAGE_LIMIT}
          onPageChange={setPage}
        />
      )}

      <AddMemberModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
}
