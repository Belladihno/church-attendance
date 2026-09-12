import { Plus } from 'lucide-react';
import { MobileSummary } from './MobileSummary';
import { MobileStagePills } from './MobileStagePills';
import { MobileVisitorCards } from './MobileVisitorCards';
import type { FirstTimersState } from '../../hooks/useFirstTimers';

export function MobileFirstTimersView({ a }: { a: FirstTimersState }) {
  return (
    <>
      <div className="md:hidden flex flex-col gap-3.5">
        <MobileSummary kpis={a.kpis} total={a.all.length} />
        <MobileStagePills
          active={a.tab}
          counts={a.counts}
          onChange={a.setTab}
          search={a.filters.search}
          onSearch={(v) => a.setFilters({ ...a.filters, search: v })}
        />
        {a.convertError && (
          <div className="bg-absent-bg text-absent text-sm rounded-lg px-4 py-2.5">{a.convertError}</div>
        )}
        {a.isLoading ? (
          <div className="text-center p-8 text-text-secondary">Loading visitors...</div>
        ) : (
          <MobileVisitorCards
            visitors={a.filtered}
            onOpen={a.openDrawer}
            onConvert={a.onConvert}
            onClear={a.clearAll}
          />
        )}
      </div>
      <button
        onClick={() => a.setModalOpen(true)}
        aria-label="Record visitor"
        className="md:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-brand-purple text-white rounded-full shadow-modal active:scale-95"
      >
        <Plus size={20} />
        <span className="text-[14px] font-semibold pr-0.5">+ Record visitor</span>
      </button>
    </>
  );
}
