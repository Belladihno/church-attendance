import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFirstTimers, convertToMember, type FirstTimer } from '../api/firstTimers';
import type { FirstTimerKpis } from '../components/first-timers/KpiCards';
import type { PipelineTab, TabCounts } from '../components/first-timers/PipelineTabs';
import type { FirstTimerFilters } from '../components/first-timers/Toolbar';

const PAGE_LIMIT = 10;

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function useFirstTimers() {
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
  const onConvert = (v: FirstTimer) => convertMut.mutate(v);
  const openDrawer = (v: FirstTimer) => setDrawerId(v.id);

  return {
    tab, setTab, filters, setFilters, page, setPage,
    modalOpen, setModalOpen, drawerId, setDrawerId, exporting, convertError,
    all, isLoading, kpis, counts, filtered, total, totalPages, safePage, visitors,
    pageLimit: PAGE_LIMIT, monthLabel, clearAll, onExport, onConvert, openDrawer,
  };
}

export type FirstTimersState = ReturnType<typeof useFirstTimers>;
