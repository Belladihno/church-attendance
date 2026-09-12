import { MobileSessionCard } from './MobileSessionCard';
import { MobileMetricStrip } from './MobileMetricStrip';
import { MobileSearchChips } from './MobileSearchChips';
import { MobileRoster } from './MobileRoster';
import { MobileSyncBar } from './MobileSyncBar';
import { MobileNoteSheet } from './MobileNoteSheet';
import { RosterSkeleton } from '../ui/skeletons/RosterSkeleton';
import type { AttendanceState } from '../../hooks/useAttendance';

export function MobileAttendanceView({ a }: { a: AttendanceState }) {
  return (
    <>
      <div className="md:hidden flex flex-col gap-3.5 max-w-lg mx-auto w-full">
        <MobileSessionCard
          selectedSunday={a.selectedSunday}
          serviceType={a.serviceType}
          onServiceChange={a.setServiceType}
        />
        <MobileMetricStrip
          total={a.total}
          recorded={a.summary.recorded}
          present={a.summary.present}
          absent={a.summary.absent}
          excused={a.summary.excused}
        />
        <MobileSearchChips
          search={a.search}
          onSearch={a.setSearch}
          department={a.department}
          onDepartmentChange={a.setDepartment}
          counts={a.deptCounts}
          total={a.membersData?.total ?? 0}
        />
        {a.isBeforeStart ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card">
            <div className="text-text-secondary">No records before September 2026</div>
            <div className="text-xs text-text-secondary/60 mt-1">Attendance tracking starts from September 2026</div>
          </div>
        ) : a.gridError && !a.grid ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card flex flex-col gap-3 items-center">
            <p className="text-sm text-text-secondary">Couldn't load the roster. Check your connection and try again.</p>
            <button
              onClick={() => a.refetchGrid()}
              className="h-10 px-5 rounded-xl bg-brand-purple text-white text-sm font-semibold active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : a.grid && a.selectedSunday ? (
          <>
            <MobileRoster
              sundays={a.grid.sundays}
              sundayIndex={a.sundayIndex}
              selectedSunday={a.selectedSunday}
              members={a.filteredMembers.slice(0, a.rosterVisible)}
              edits={a.edits}
              meta={a.memberMeta}
              todayStr={a.mobileTodayStr}
              expandedId={a.expandedId}
              onExpand={a.setExpandedId}
              onMark={a.onMark}
              onNote={a.setNoteMember}
            />
            {a.rosterVisible < a.filteredMembers.length && (
              <button
                onClick={() => a.setRosterVisible((n) => n + 25)}
                className="w-full py-3 rounded-xl bg-white text-brand-purple text-[13px] font-semibold border border-border/70 shadow-card active:bg-bg-base"
              >
                Show more ({a.filteredMembers.length - a.rosterVisible} remaining)
              </button>
            )}
          </>
        ) : (
          <RosterSkeleton />
        )}
      </div>
      {a.grid && a.selectedSunday && !a.isBeforeStart && (
        <MobileSyncBar
          pending={Object.keys(a.edits).length}
          saving={a.mut.isPending}
          onMarkRest={a.onMarkRest}
          onSync={() => a.mut.mutate()}
        />
      )}
      <MobileNoteSheet
        member={a.noteMember}
        meta={a.noteMeta}
        deptRole={a.noteDeptRole}
        onClose={() => a.setNoteMember(null)}
      />
    </>
  );
}
