import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import type { FollowUpTab, FollowUpFilters } from '../components/follow-ups/FilterBar';
import type { CareModalMode } from '../components/follow-ups/CareModal';
import { subjectOf, reasonCategory, unitOf } from '../components/follow-ups/labels';

export function useFollowUps() {
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

  const onStatus = (id: string, status: FollowUp['status']) => statusMut.mutate({ id, status });
  const openCreate = () => setModal({ open: true, mode: 'create', followUp: null });
  const openNote = (followUp: FollowUp) => setModal({ open: true, mode: 'note', followUp });
  const openReassign = (followUp: FollowUp) => setModal({ open: true, mode: 'reassign', followUp });
  const closeModal = () => setModal({ open: false, mode: 'create', followUp: null });

  return {
    tab, setTab, filters, setFilters, unit, setUnit,
    modal, drawerId, setDrawerId, busyId, banner,
    detecting, creating, detected,
    members: membersData?.data ?? [], firstTimers,
    absent2Set, absent3Set, absent3Count: absent3.length, twoOnly,
    units, counts, assignees, filtered, clearAll, active, isLoading,
    onDetect, onCreateTickets, invalidate,
    onStatus, openCreate, openNote, openReassign, closeModal,
  };
}

export type FollowUpsState = ReturnType<typeof useFollowUps>;
