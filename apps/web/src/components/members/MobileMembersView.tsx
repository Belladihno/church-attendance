import { Plus } from 'lucide-react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileMemberChips } from './MobileMemberChips';
import { MobileMemberCards } from './MobileMemberCards';
import { MobileMemberSheet } from './MobileMemberSheet';
import type { MembersState } from '../../hooks/useMembers';

export function MobileMembersView({ a }: { a: MembersState }) {
  return (
    <>
      <div className="md:hidden flex flex-col gap-4 max-w-lg mx-auto w-full">
        <MobileStatusBar
          total={a.stats?.total ?? a.total}
          consistency={a.overview ? Math.round(a.overview.attendanceRate * 10) / 10 : null}
          care={a.detect2.length}
        />
        <MobileMemberChips
          search={a.filters.search}
          onSearch={(v) => a.handleFilterChange({ ...a.filters, search: v })}
          chip={a.chip}
          onChip={a.onChip}
          counts={{
            all: a.stats?.total ?? a.total,
            workers: a.stats?.workers ?? 0,
            choir: a.choirCount?.total ?? 0,
            ushers: a.usherCount?.total ?? 0,
            care: a.detect2.length,
          }}
        />
        {a.isLoading && !a.careOnly ? (
          <div className="text-center p-8 text-text-secondary">Loading members...</div>
        ) : (
          <MobileMemberCards
            members={a.cardMembers}
            rates={a.rates}
            page={a.careOnly ? 1 : a.page}
            totalPages={a.careOnly ? 1 : a.totalPages}
            total={a.careOnly ? a.cardMembers.length : a.total}
            onPageChange={a.setPage}
            onOpen={a.setSheetMember}
            onClear={a.clearAll}
          />
        )}
      </div>
      <button
        onClick={() => a.setModalOpen(true)}
        aria-label="Add new member"
        className="md:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-brand-purple text-white shadow-lg active:scale-95"
      >
        <Plus size={20} />
        <span className="text-[14px] font-semibold tracking-wide pr-0.5">Add member</span>
      </button>
      <MobileMemberSheet
        member={a.sheetMember}
        rate={a.sheetMember ? a.rates[a.sheetMember.id] ?? null : null}
        onClose={() => a.setSheetMember(null)}
      />
    </>
  );
}
