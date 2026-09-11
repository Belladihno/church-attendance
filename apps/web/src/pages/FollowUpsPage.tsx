import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Plus } from 'lucide-react';
import {
  getFollowUps,
  updateFollowUp,
  createFollowUp,
  detectFollowUps,
  type FollowUp,
  type AbsentMember,
} from '../api/followUps';
import { getMembers } from '../api/members';
import { getFirstTimers } from '../api/firstTimers';
import { StatCards } from '../components/follow-ups/StatCards';
import { FilterBar, type FollowUpTab, type FollowUpFilters } from '../components/follow-ups/FilterBar';
import { CareCard } from '../components/follow-ups/CareCard';
import { CareModal, type CareModalMode } from '../components/follow-ups/CareModal';
import { CareDrawer } from '../components/follow-ups/CareDrawer';
import { MobileSummary } from '../components/follow-ups/MobileSummary';
import { MobileTabs } from '../components/follow-ups/MobileTabs';
import { MobileCareCards } from '../components/follow-ups/MobileCareCards';
import { subjectOf, reasonCategory, unitOf } from '../components/follow-ups/labels';

export function FollowUpsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<FollowUpTab>('ALL');
  const [filters, setFilters] = useState<FollowUpFilters>({ search: '', reason: '', assignedTo: '' });
  const [unit, setUnit] = useState('all');
  const [modal, setModal] = useState<{ open: boolean; mode: CareModalMode; followUp: FollowUp | null }>({
    open: false,
    mode: 'create',
    followUp: null,
  });
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [detected, setDetected] = useState<AbsentMember[] | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const { data: followUps = [], isLoading } = useQuery({
    queryKey: ['follow-ups'],
    queryFn: () => getFollowUps(),
  });

  const { data: membersData } = useQuery({
    queryKey: ['members', 'all-for-followups'],
    queryFn: () => getMembers({ page: 1, limit: 500 }),
  });

  const { data: firstTimers = [] } = useQuery({
    queryKey: ['first-timers'],
    queryFn: () => getFirstTimers(),
  });

  const { data: absent2 = [] } = useQuery({
    queryKey: ['follow-ups', 'detect-2'],
    queryFn: () => detectFollowUps(2),
  });

  const { data: absent3 = [] } = useQuery({
    queryKey: ['follow-ups', 'detect-3'],
    queryFn: () => detectFollowUps(3),
  });

  const absent2Set = useMemo(() => new Set(absent2.map((m) => m.id)), [absent2]);
  const absent3Set = useMemo(() => new Set(absent3.map((m) => m.id)), [absent3]);
  const twoOnly = Math.max(0, absent2.length - absent3.length);

  const units = useMemo(() => {
    const set = new Set<string>();
    for (const f of followUps) set.add(unitOf(f));
    const depts = [...set].filter((u) => u !== 'FIRST_TIMERS').sort();
    return set.has('FIRST_TIMERS') ? ['FIRST_TIMERS', ...depts] : depts;
  }, [followUps]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['follow-ups'] });
    qc.invalidateQueries({ queryKey: ['follow-up'] });
  };

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateFollowUp(id, { status }),
    onMutate: ({ id }) => setBusyId(id),
    onSettled: () => setBusyId(null),
    onSuccess: invalidate,
  });

  const counts = useMemo(() => {
    const c: Record<FollowUpTab, number> = { ALL: followUps.length, PENDING: 0, CONTACTED: 0, RESOLVED: 0, CLOSED: 0 };
    for (const f of followUps) c[f.status as FollowUpTab]++;
    return c;
  }, [followUps]);

  const assignees = useMemo(() => {
    const set = new Set<string>();
    for (const f of followUps) if (f.assignedTo) set.add(f.assignedTo);
    return [...set].sort();
  }, [followUps]);

  const filtered = useMemo(() => {
    return followUps.filter((f) => {
      if (tab !== 'ALL' && f.status !== tab) return false;
      if (filters.reason && reasonCategory(f.reason) !== filters.reason) return false;
      if (filters.assignedTo && f.assignedTo !== filters.assignedTo) return false;
      if (unit !== 'all' && unitOf(f) !== unit) return false;
      if (debouncedSearch) {
        const s = subjectOf(f);
        const hay = `${s.name} ${s.phone} ${f.reason} ${f.assignedTo ?? ''} ${f.notes ?? ''}`.toLowerCase();
        if (!hay.includes(debouncedSearch)) return false;
      }
      return true;
    });
  }, [followUps, tab, filters.reason, filters.assignedTo, unit, debouncedSearch]);

  const clearAll = () => { setTab('ALL'); setFilters({ search: '', reason: '', assignedTo: '' }); setUnit('all'); };

  const active = counts.PENDING + counts.CONTACTED;

  const onDetect = async () => {
    setDetecting(true);
    setBanner(null);
    try {
      const [two, three] = await Promise.all([detectFollowUps(2), detectFollowUps(3)]);
      setDetected(two);
      qc.invalidateQueries({ queryKey: ['follow-ups', 'detect-3'] });
      setBanner(
        two.length === 0
          ? 'Attendance database scanned: no members absent 2+ consecutive Sundays.'
          : `Scan complete: ${two.length} member${two.length === 1 ? '' : 's'} absent 2+ Sundays (${three.length} at 3+). Create tickets for those without an open record below.`,
      );
    } finally {
      setDetecting(false);
    }
  };

  const onCreateTickets = async () => {
    if (!detected) return;
    setCreating(true);
    try {
      const openMemberIds = new Set(
        followUps.filter((f) => f.status === 'PENDING' || f.status === 'CONTACTED').map((f) => f.memberId).filter(Boolean),
      );
      let created = 0;
      for (const m of detected) {
        if (openMemberIds.has(m.id)) continue;
        // eslint-disable-next-line no-await-in-loop
        await createFollowUp({ memberId: m.id, reason: 'Absent 2 consecutive Sundays', status: 'PENDING' });
        created++;
      }
      setBanner(
        created === 0
          ? 'Everyone detected already has an open care record.'
          : `Created ${created} new care ticket${created === 1 ? '' : 's'}.`,
      );
      setDetected(null);
      invalidate();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-5 max-w-lg mx-auto w-full">
        <MobileSummary
          active={active}
          pending={counts.PENDING}
          contacted={counts.CONTACTED}
          twoOnly={twoOnly}
          threePlus={absent3.length}
        />
        <MobileTabs
          tab={tab}
          counts={counts}
          onTab={setTab}
          search={filters.search}
          onSearch={(v) => setFilters({ ...filters, search: v })}
          units={units}
          unit={unit}
          onUnit={setUnit}
        />
        {banner && (
          <div className="bg-[#EAE7F8] text-brand-purple text-sm rounded-lg px-4 py-2.5">{banner}</div>
        )}
        {isLoading ? (
          <div className="text-center p-8 text-text-secondary">Loading follow-ups...</div>
        ) : (
          <MobileCareCards
            tickets={filtered}
            absent2={absent2Set}
            absent3={absent3Set}
            busyId={busyId}
            onStatus={(id, status) => statusMut.mutate({ id, status })}
            onNote={(fu) => setModal({ open: true, mode: 'note', followUp: fu })}
            onOpen={(fu) => setDrawerId(fu.id)}
            onClear={clearAll}
          />
        )}
      </div>
      <button
        onClick={() => setModal({ open: true, mode: 'create', followUp: null })}
        aria-label="New care ticket"
        className="md:hidden fixed bottom-20 right-4 z-40 h-12 px-5 rounded-full bg-brand-purple text-white font-semibold text-[14px] flex items-center gap-2 shadow-modal active:scale-95"
      >
        <Plus size={20} />
        <span>New care ticket</span>
      </button>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-text-primary">Follow-ups &amp; Member Care</h1>
          <p className="text-[13px] text-text-secondary mt-1">Tracking members absent 2+ consecutive Sundays and first-time visitor outreach</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onDetect}
            disabled={detecting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={17} className={detecting ? 'animate-spin' : ''} />
            <span>{detecting ? 'Scanning...' : 'Auto-detect absences'}</span>
          </button>
          <button
            onClick={() => setModal({ open: true, mode: 'create', followUp: null })}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Create follow-up</span>
          </button>
        </div>
      </div>

      <StatCards
        active={active}
        pending={counts.PENDING}
        absent3Plus={absent3.length}
        contacted={counts.CONTACTED}
        resolved={counts.RESOLVED}
      />

      {banner && (
        <div className="bg-[#EAE7F8] text-brand-purple text-sm rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <span>{banner}</span>
          {detected && detected.length > 0 && (
            <button
              onClick={onCreateTickets}
              disabled={creating}
              className="h-8 px-3 rounded-lg bg-brand-purple text-white text-[13px] font-semibold disabled:opacity-50 shrink-0"
            >
              {creating ? 'Creating...' : `Create tickets (${detected.length})`}
            </button>
          )}
        </div>
      )}

      <FilterBar
        tab={tab}
        counts={counts}
        onTab={setTab}
        filters={filters}
        onFilters={setFilters}
        assignees={assignees}
        shown={filtered.length}
      />

      {isLoading ? (
        <div className="text-center p-8 text-text-secondary">Loading follow-ups...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <p className="text-sm text-text-secondary">No care records in this view.</p>
          <button
            onClick={() => { setTab('ALL'); setFilters({ search: '', reason: '', assignedTo: '' }); }}
            className="mt-3 text-sm text-brand-purple hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((f) => (
            <CareCard
              key={f.id}
              followUp={f}
              busy={busyId === f.id}
              onStatus={(id, status) => statusMut.mutate({ id, status })}
              onNote={(fu) => setModal({ open: true, mode: 'note', followUp: fu })}
              onReassign={(fu) => setModal({ open: true, mode: 'reassign', followUp: fu })}
              onOpen={(fu) => setDrawerId(fu.id)}
            />
          ))}
        </div>
      )}

      </div>

      <CareModal
        open={modal.open}
        mode={modal.mode}
        followUp={modal.followUp}
        members={membersData?.data ?? []}
        firstTimers={firstTimers}
        onClose={() => setModal({ open: false, mode: 'create', followUp: null })}
        onSaved={invalidate}
      />
      <CareDrawer id={drawerId} onClose={() => setDrawerId(null)} />
    </div>
  );
}
