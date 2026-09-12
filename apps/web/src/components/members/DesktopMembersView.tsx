import { Download, Plus } from 'lucide-react';
import { MetricRibbon } from './MetricRibbon';
import { FilterToolbar } from './FilterToolbar';
import { MembersTable } from './MembersTable';
import { MembersListSkeleton } from '../ui/skeletons/MembersListSkeleton';
import type { MembersState } from '../../hooks/useMembers';

export function DesktopMembersView({ a }: { a: MembersState }) {
  return (
    <div className="hidden md:flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Members Directory</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#EAE7F8] text-brand-purple text-xs font-semibold">
              Parish Roll
            </span>
          </div>
          <p className="text-[13px] text-text-secondary">
            {a.stats?.total ?? a.total} registered members
            {a.stats && a.stats.departments > 0 ? ` across ${a.stats.departments} ministry units` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={a.onExport}
            disabled={a.exporting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={17} />
            <span>{a.exporting ? 'Exporting...' : 'Export Directory (CSV)'}</span>
          </button>
          <button
            onClick={() => a.setModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card transition-all flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      <MetricRibbon stats={a.stats} />

      <FilterToolbar
        filters={a.filters}
        onChange={a.handleFilterChange}
        shown={a.members.length}
        total={a.total}
        active={a.stats?.active ?? 0}
      />

      {a.isLoading ? (
        <MembersListSkeleton />
      ) : a.members.length === 0 ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <p className="text-sm text-text-secondary">No members match these filters.</p>
          <button
            onClick={a.clearAll}
            className="mt-3 text-sm text-brand-purple hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <MembersTable
          members={a.members}
          rates={a.rates}
          ratesLoading={a.ratesLoading}
          page={a.page}
          totalPages={a.totalPages}
          total={a.total}
          limit={a.pageLimit}
          onPageChange={a.setPage}
        />
      )}
    </div>
  );
}
