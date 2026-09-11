import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Download, Plus } from 'lucide-react';
import { getMembers, getMember, getMemberStats } from '../api/members';
import { MetricRibbon } from '../components/members/MetricRibbon';
import { FilterToolbar, type MemberFilters } from '../components/members/FilterToolbar';
import { MembersTable } from '../components/members/MembersTable';
import { AddMemberModal } from '../components/members/AddMemberModal';

const PAGE_LIMIT = 10;

export function MembersListPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    department: '',
    churchRole: '',
    status: '',
    gender: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Debounce search 300ms
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.department, filters.churchRole, filters.status, filters.gender]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.department ? { department: filters.department } : {}),
      ...(filters.gender ? { gender: filters.gender } : {}),
      ...(filters.churchRole ? { churchRole: filters.churchRole } : {}),
    }),
    [page, debouncedSearch, filters.status, filters.department, filters.gender, filters.churchRole],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['members', queryParams],
    queryFn: () => getMembers(queryParams),
  });

  const { data: stats } = useQuery({
    queryKey: ['members-stats'],
    queryFn: getMemberStats,
  });

  const members = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  // Per-member attendance rates (uses existing GET /members/:id which includes rate)
  const rateQueries = useQueries({
    queries: members.map((m) => ({
      queryKey: ['member-rate', m.id],
      queryFn: () => getMember(m.id),
      select: (d: { attendance?: { rate?: number } }) => d.attendance?.rate ?? null,
      staleTime: 60_000,
    })),
  });
  const ratesLoading = rateQueries.some((q) => q.isLoading);
  const rates: Record<string, number | null> = {};
  members.forEach((m, i) => {
    const q = rateQueries[i];
    rates[m.id] = q?.data ?? null;
  });

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
        onChange={setFilters}
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
            onClick={() => setFilters({ search: '', department: '', churchRole: '', status: '', gender: '' })}
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
  );
}
