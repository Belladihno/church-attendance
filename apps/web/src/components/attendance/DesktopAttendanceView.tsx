import { SubHeader } from './SubHeader';
import { SummaryStrip } from './SummaryStrip';
import { GridControls } from './GridControls';
import { AttendanceMatrix } from './AttendanceMatrix';
import type { AttendanceState } from '../../hooks/useAttendance';

export function DesktopAttendanceView({ a }: { a: AttendanceState }) {
  return (
    <div className="hidden md:flex flex-col gap-6">
      <SubHeader
        month={a.month}
        year={a.year}
        serviceType={a.serviceType}
        onServiceChange={a.setServiceType}
      />
      <SummaryStrip
        total={a.total}
        recorded={a.summary.recorded}
        present={a.summary.present}
        absent={a.summary.absent}
        excused={a.summary.excused}
        absentDelta={a.summary.absentDelta}
        label={a.summary.label}
      />
      <GridControls
        monthLabel={a.monthLabel}
        onPrev={a.onPrevMonth}
        onNext={a.onNextMonth}
        search={a.search}
        onSearch={a.setSearch}
        department={a.department}
        onDepartmentChange={a.setDepartment}
        onBulkPresent={a.onBulkPresent}
        onSave={() => a.mut.mutate()}
        pending={Object.keys(a.edits).length}
        saving={a.mut.isPending}
      />
      {a.isBeforeStart ? (
        <div className="bg-bg-card rounded-xl p-12 text-center shadow-card">
          <div className="text-text-secondary">No records before September 2026</div>
          <div className="text-xs text-text-secondary/60 mt-1">Attendance tracking starts from September 2026</div>
        </div>
      ) : a.gridError && !a.grid ? (
        <div className="bg-bg-card rounded-xl p-8 text-center shadow-card flex flex-col gap-3 items-center">
          <p className="text-sm text-text-secondary">Couldn't load the grid. Check your connection and try again.</p>
          <button
            onClick={() => a.refetchGrid()}
            className="h-10 px-5 rounded-lg bg-brand-purple text-white text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      ) : a.grid ? (
        <AttendanceMatrix
          sundays={a.grid.sundays}
          members={a.filteredMembers}
          edits={a.edits}
          onToggle={a.onToggle}
          selectedSunday={a.selectedSunday}
          onSelectSunday={a.setSelectedSunday}
        />
      ) : (
        <div className="text-center p-8 text-text-secondary">Loading grid...</div>
      )}
    </div>
  );
}
