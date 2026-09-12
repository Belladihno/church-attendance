import { Download, Plus } from 'lucide-react';
import { KpiCards } from './KpiCards';
import { PipelineTabs } from './PipelineTabs';
import { Toolbar } from './Toolbar';
import { FirstTimersTable } from './FirstTimersTable';
import { FirstTimersSkeleton } from '../ui/skeletons/FirstTimersSkeleton';
import type { FirstTimersState } from '../../hooks/useFirstTimers';

export function DesktopFirstTimersView({ a }: { a: FirstTimersState }) {
  return (
    <div className="hidden md:flex flex-col gap-4">
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
            onClick={a.onExport}
            disabled={a.exporting}
            className="h-10 px-4 rounded-lg bg-bg-card hover:bg-bg-base text-brand-purple font-medium text-sm shadow-card flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={17} />
            <span>{a.exporting ? 'Exporting...' : 'Export Visitor Log'}</span>
          </button>
          <button
            onClick={() => a.setModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-medium text-sm shadow-card flex items-center gap-2"
          >
            <Plus size={17} />
            <span>+ Record First Timer</span>
          </button>
        </div>
      </div>

      <KpiCards kpis={a.kpis} total={a.all.length} />

      {a.convertError && (
        <div className="bg-absent-bg text-absent text-sm rounded-lg px-4 py-2.5">{a.convertError}</div>
      )}

      <div className="bg-bg-card rounded-xl shadow-card flex flex-col">
        <PipelineTabs active={a.tab} counts={a.counts} onChange={a.setTab} />
        <Toolbar filters={a.filters} onChange={a.setFilters} monthLabel={a.monthLabel} />
        {a.isLoading ? (
          <FirstTimersSkeleton />
        ) : a.filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-text-secondary">No visitors match this view.</p>
            <button
              onClick={a.clearAll}
              className="mt-3 text-sm text-brand-purple hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <FirstTimersTable
            visitors={a.visitors}
            total={a.total}
            page={a.safePage}
            totalPages={a.totalPages}
            limit={a.pageLimit}
            onPageChange={a.setPage}
            onOpen={a.openDrawer}
            onConvert={a.onConvert}
          />
        )}
      </div>
    </div>
  );
}
