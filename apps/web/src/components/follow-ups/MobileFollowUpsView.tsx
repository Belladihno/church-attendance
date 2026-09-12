import { Plus } from 'lucide-react';
import { MobileSummary } from './MobileSummary';
import { MobileTabs } from './MobileTabs';
import { MobileCareCards } from './MobileCareCards';
import { FollowUpsSkeleton } from '../ui/skeletons/FollowUpsSkeleton';
import type { FollowUpsState } from '../../hooks/useFollowUps';

export function MobileFollowUpsView({ a }: { a: FollowUpsState }) {
  return (
    <>
      <div className="md:hidden flex flex-col gap-5 max-w-lg mx-auto w-full">
        <MobileSummary
          active={a.active}
          pending={a.counts.PENDING}
          contacted={a.counts.CONTACTED}
          twoOnly={a.twoOnly}
          threePlus={a.absent3Count}
        />
        <MobileTabs
          tab={a.tab}
          counts={a.counts}
          onTab={a.setTab}
          search={a.filters.search}
          onSearch={(v) => a.setFilters({ ...a.filters, search: v })}
          units={a.units}
          unit={a.unit}
          onUnit={a.setUnit}
        />
        {a.banner && (
          <div className="bg-[#EAE7F8] text-brand-purple text-sm rounded-lg px-4 py-2.5">{a.banner}</div>
        )}
        {a.isLoading ? (
          <FollowUpsSkeleton />
        ) : (
          <MobileCareCards
            tickets={a.filtered}
            absent2={a.absent2Set}
            absent3={a.absent3Set}
            busyId={a.busyId}
            onStatus={a.onStatus}
            onNote={a.openNote}
            onOpen={(fu) => a.setDrawerId(fu.id)}
            onClear={a.clearAll}
          />
        )}
      </div>
      <button
        onClick={a.openCreate}
        aria-label="New care ticket"
        className="md:hidden fixed bottom-20 right-4 z-40 h-12 px-5 rounded-full bg-brand-purple text-white font-semibold text-[14px] flex items-center gap-2 shadow-modal active:scale-95"
      >
        <Plus size={20} />
        <span>New care ticket</span>
      </button>
    </>
  );
}
