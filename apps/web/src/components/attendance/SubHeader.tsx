export function SubHeader({
  month,
  year,
  serviceType,
  onServiceChange,
}: {
  month: number;
  year: number;
  serviceType: string;
  onServiceChange: (v: string) => void;
}) {
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2 text-xs text-text-secondary'>
          <span>Grace Chapel</span>
          <span className='text-text-secondary/50'>›</span>
          <span>Attendance</span>
          <span className='text-text-secondary/50'>›</span>
          <span className='font-semibold text-text-primary'>Monthly Grid</span>
        </div>
        <div className='flex flex-wrap items-center gap-3 mt-1'>
          <h1 className='text-2xl font-semibold text-text-primary'>
            Mark Attendance
          </h1>
          <span className='flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7F8] text-brand-purple text-xs font-medium'>
            <span className='w-2 h-2 rounded-full bg-brand-purple' />
            {monthLabel} — {serviceType === 'SUNDAY_SERVICE' ? 'Sunday Service' : 'Sunday School'}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-1 bg-[#F6F1FF] p-1 rounded-xl w-fit'>
        <button
          onClick={() => onServiceChange('SUNDAY_SERVICE')}
          className={`px-4 py-1 rounded-lg text-sm font-semibold ${serviceType === 'SUNDAY_SERVICE' ? 'bg-bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Sunday Service (Main)
        </button>
        <button
          onClick={() => onServiceChange('SUNDAY_SCHOOL')}
          className={`px-4 py-1 rounded-lg text-sm ${serviceType === 'SUNDAY_SCHOOL' ? 'bg-bg-card shadow-sm text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Sunday School
        </button>
        <button className='px-4 py-1 rounded-lg text-text-secondary hover:text-text-primary text-sm'>
          Midweek Digging Deep
        </button>
      </div>
    </div>
  );
}
