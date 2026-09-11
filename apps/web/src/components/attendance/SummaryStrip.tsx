type Props = {
  total: number;
  recorded: number;
  present: number;
  absent: number;
  excused: number;
  absentDelta?: number | null;
};

export function SummaryStrip({
  total,
  recorded,
  present,
  absent,
  excused,
  absentDelta,
}: Props) {
  const coverage = total ? Math.round((recorded / total) * 100 * 10) / 10 : 0;
  const presentPct = recorded
    ? Math.round((present / recorded) * 100 * 10) / 10
    : 0;

  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
      <div className='bg-bg-card rounded-xl p-4 shadow-card flex flex-col justify-between'>
        <span className='text-xs text-text-secondary'>Total Registered</span>
        <div className='flex items-baseline justify-between mt-2'>
          <span className='text-2xl font-bold text-text-primary'>{total}</span>
          <span className='text-xs font-semibold text-text-secondary'>
            Active Roll
          </span>
        </div>
      </div>
      <div className='bg-bg-card rounded-xl p-4 shadow-card flex flex-col justify-between'>
        <span className='text-xs text-text-secondary'>Recorded Today</span>
        <div className='flex items-baseline justify-between mt-2'>
          <span className='text-2xl font-bold text-brand-purple'>
            {recorded}
          </span>
          <span className='text-xs font-semibold text-brand-green'>
            {coverage}% Coverage
          </span>
        </div>
      </div>
      <div className='bg-bg-card rounded-xl p-4 shadow-card flex flex-col justify-between bg-present-bg/25'>
        <span className='text-xs text-present'>Present Today</span>
        <div className='flex items-baseline justify-between mt-2'>
          <span className='text-2xl font-bold text-present'>{present}</span>
          <span className='text-xs px-2 py-0.5 rounded bg-present-bg text-present font-semibold'>
            {presentPct}%
          </span>
        </div>
      </div>
      <div className='bg-bg-card rounded-xl p-4 shadow-card flex flex-col justify-between bg-absent-bg/25'>
        <span className='text-xs text-absent'>Absent Today</span>
        <div className='flex items-baseline justify-between mt-2'>
          <span className='text-2xl font-bold text-absent'>{absent}</span>
          <span className='text-xs text-absent'>
            {absentDelta === null || absentDelta === undefined ? '—' : `${absentDelta > 0 ? '+' : ''}${absentDelta} from last week`}
          </span>
        </div>
      </div>
      <div className='bg-bg-card rounded-xl p-4 shadow-card flex flex-col justify-between'>
        <span className='text-xs text-text-secondary'>Excused / Offsite</span>
        <div className='flex items-baseline justify-between mt-2'>
          <span className='text-2xl font-bold text-text-secondary'>
            {excused}
          </span>
          <span className='text-xs px-2 py-0.5 rounded bg-[#EEECF7] text-[#5A5480] font-semibold'>
            Approved
          </span>
        </div>
      </div>
    </div>
  );
}
