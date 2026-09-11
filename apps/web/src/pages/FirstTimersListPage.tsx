import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Plus } from 'lucide-react';
import { getFirstTimers, convertToMember, type FirstTimer } from '../api/firstTimers';
import { KpiCards, type FirstTimerKpis } from '../components/first-timers/KpiCards';
import { PipelineTabs, type PipelineTab, type TabCounts } from '../components/first-timers/PipelineTabs';
import { Toolbar, type FirstTimerFilters } from '../components/first-timers/Toolbar';
import { FirstTimersTable } from '../components/first-timers/FirstTimersTable';
import { RecordFirstTimerModal } from '../components/first-timers/RecordFirstTimerModal';
import { VisitorDrawer } from '../components/first-timers/VisitorDrawer';
import { MobileSummary } from '../components/first-timers/MobileSummary';
import { MobileStagePills } from '../components/first-timers/MobileStagePills';
import { MobileVisitorCards } from '../components/first-timers/MobileVisitorCards';

const PAGE_LIMIT = 10;

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function FirstTimersListPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<PipelineTab>('ALL');
  const [filters, setFilters] = useState<FirstTimerFilters>({ search: '', service: '', gender: '' });
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedSearch, filters.service, filters.gender]);

  const { data: all = [], isLoading } = useQuery({
    queryKey: ['first-timers'],
    queryFn: () => getFirstTimers(),
  });

  const now = new Date();
  const thisKey = monthKey(now);
  const lastKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const kpis: FirstTimerKpis = useMemo(() => ({
    thisMonth: all.filter((v) => v.dateAttended.slice(0, 7) === thisKey).length,
    lastMonth: all.filter((v) => v.dateAttended.slice(0, 7) === lastKey).length,
    pending: all.filter((v) => v.followUpStatus === 'PENDING').length,
    contacted: all.filter((v) => v.followUpStatus === 'CONTACTED').length,
    converted: all.filter((v) => v.followUpStatus === 'CONVERTED').length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [all]);

  const counts: TabCounts = useMemo(() => ({
    ALL: all.length,
    PENDING: kpis.pending,
    CONTACTED: kpis.contacted,
    CONVERTED: kpis.converted,
    CLOSED: all.filter((v) => v.followUpStatus === 'CLOSED').length,
  }), [all, kpis]);

  const filtered = useMemo(() => {
    return all.filter((v) => {
      if (tab !== 'ALL' && v.followUpStatus !== tab) return false;
      if (filters.service && v.serviceAttended !== filters.service) return false;
      if (filters.gender && v.gender !== filters.gender) return false;
      if (debouncedSearch) {
        const hay = `${v.firstName} ${v.lastName} ${v.phone} ${v.invitedBy ?? ''}`.toLowerCase();
        if (!hay.includes(debouncedSearch)) return false;
      }
      return true;
    });
  }, [all, tab, filters.service, filters.gender, debouncedSearch]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const visitors = filtered.slice((safePage - 1) * PAGE_LIMIT, safePage * PAGE_LIMIT);

  const convertMut = useMutation({
    mutationFn: (v: FirstTimer) => convertToMember(v.id),
    onSuccess: (_res, v) => {
      setConvertError(null);
      qc.invalidateQueries({ queryKey: ['first-timers'] });
      setDrawerId(v.id);
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Conversion failed';
      setConvertError(msg);
    },
  });

  const onExport = async () => {
    setExporting(true);
    try {
      const header = 'First Name,Last Name,Phone,Gender,Address,Date Attended,Service,Invited By,How Heard,Status';
      const esc = (s: string | null | undefined) => `"${(s || '').replace(/"/g, '""')}"`;
      const rows = filtered.map((v) =>
        [v.firstName, v.lastName, v.phone, v.gender, esc(v.address), v.dateAttended, v.serviceAttended, esc(v.invitedBy), esc(v.howHeard), v.followUpStatus].join(','),
      );
      const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'visitor-log.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const clearAll = () => { setTab('ALL'); setFilters({ search: '', service: '', gender: '' }); };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-3.5">
        <MobileSummary kpis={kpis} total={all.length} />
        <MobileStagePills
          active={tab}
          counts={counts}
          onChange={setTab}
          search={filters.search}
          onSearch={(v) => setFilters({ ...filters, search: v })}
        />
        {convertError && (
          <div className="bg-absent-bg text-absent text-sm rounded-lg px-4 py-2.5">{convertError}</div>
        )}
        {isLoading ? (
          <div className="text-center p-8 text-text-secondary">Loading visitors...</div>
        ) : (
          <MobileVisitorCards
            visitors={filtered}
            onOpen={(v) => setDrawerId(v.id)}
            onConvert={(v) => convertMut.mutate(v)}
            onClear={clearAll}
          />
        )}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Record visitor"
        className="md:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-brand-purple text-white rounded-full shadow-modal active:scale-95"
      >
        <Plus size={20} />
        <span className="text-[14px] font-semibold pr-0.5">+ Record visitor</span>
      </button>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-purple text-white text-[11px] uppercase tracking-wider font-semibold">
              Assimilation Pipeline
            </span>
            <span className="text-xs text-text-secondary">• Day 1 to Day 30 Track</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">First Timers &amp; Assimilation</h1>
          <p className="text-[13px] text-text-secondary">Visitor intake tracking, follow-up workflow, and membership conversion.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExport}
            disabled={exporting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={17} />
            <span>{exporting ? 'Exporting...' : 'Export Visitor Log'}</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Record First Timer</span>
          </button>
        </div>
      </div>

      <KpiCards kpis={kpis} total={all.length} />

      {convertError && (
        <div className="bg-absent-bg text-absent text-sm rounded-lg px-4 py-2.5">{convertError}</div>
      )}

      <div className="bg-bg-card rounded-xl shadow-card flex flex-col">
        <PipelineTabs active={tab} counts={counts} onChange={setTab} />
        <Toolbar filters={filters} onChange={setFilters} monthLabel={monthLabel} />
        {isLoading ? (
          <div className="text-center p-8 text-text-secondary">Loading visitors...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-text-secondary">No visitors match this view.</p>
            <button
              onClick={() => { setTab('ALL'); setFilters({ search: '', service: '', gender: '' }); }}
              className="mt-3 text-sm text-brand-purple hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <FirstTimersTable
            visitors={visitors}
            total={total}
            page={safePage}
            totalPages={totalPages}
            limit={PAGE_LIMIT}
            onPageChange={setPage}
            onOpen={(v) => setDrawerId(v.id)}
            onConvert={(v) => convertMut.mutate(v)}
          />
        )}
      </div>

      </div>

      <RecordFirstTimerModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <VisitorDrawer id={drawerId} onClose={() => setDrawerId(null)} />
    </div>
  );
}
