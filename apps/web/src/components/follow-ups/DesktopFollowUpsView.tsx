import { RefreshCw, Plus } from 'lucide-react';
import { StatCards } from './StatCards';
import { FilterBar } from './FilterBar';
import { CareCard } from './CareCard';
import { FollowUpsSkeleton } from '../ui/skeletons/FollowUpsSkeleton';
import type { FollowUpsState } from '../../hooks/useFollowUps';

export function DesktopFollowUpsView({ a }: { a: FollowUpsState }) {
  return (
    <div className="hidden md:flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-text-primary">Follow-ups &amp; Member Care</h1>
          <p className="text-[13px] text-text-secondary mt-1">Tracking members absent 2+ consecutive Sundays and first-time visitor outreach</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={a.onDetect}
            disabled={a.detecting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={17} className={a.detecting ? 'animate-spin' : ''} />
            <span>{a.detecting ? 'Scanning...' : 'Auto-detect absences'}</span>
          </button>
          <button
            onClick={a.openCreate}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Create follow-up</span>
          </button>
        </div>
      </div>

      <StatCards
        active={a.active}
        pending={a.counts.PENDING}
        absent3Plus={a.absent3Count}
        contacted={a.counts.CONTACTED}
        resolved={a.counts.RESOLVED}
      />

      {a.banner && (
        <div className="bg-[#EAE7F8] text-brand-purple text-sm rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <span>{a.banner}</span>
          {a.detected && a.detected.length > 0 && (
            <button
              onClick={a.onCreateTickets}
              disabled={a.creating}
              className="h-8 px-3 rounded-lg bg-brand-purple text-white text-[13px] font-semibold disabled:opacity-50 shrink-0"
            >
              {a.creating ? 'Creating...' : `Create tickets (${a.detected.length})`}
            </button>
          )}
        </div>
      )}

      <FilterBar
        tab={a.tab}
        counts={a.counts}
        onTab={a.setTab}
        filters={a.filters}
        onFilters={a.setFilters}
        assignees={a.assignees}
        shown={a.filtered.length}
      />

      {a.isLoading ? (
        <FollowUpsSkeleton />
      ) : a.filtered.length === 0 ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <p className="text-sm text-text-secondary">No care records in this view.</p>
          <button
            onClick={a.clearAll}
            className="mt-3 text-sm text-brand-purple hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {a.filtered.map((f) => (
            <CareCard
              key={f.id}
              followUp={f}
              busy={a.busyId === f.id}
              onStatus={a.onStatus}
              onNote={a.openNote}
              onReassign={a.openReassign}
              onOpen={(fu) => a.setDrawerId(fu.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
