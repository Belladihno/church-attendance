export type PipelineTab = 'ALL' | 'PENDING' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';

export type TabCounts = Record<PipelineTab, number>;

const TABS: { key: PipelineTab; label: string }[] = [
  { key: 'ALL', label: 'All visitors' },
  { key: 'PENDING', label: 'Pending first call' },
  { key: 'CONTACTED', label: 'In follow-up' },
  { key: 'CONVERTED', label: 'Converted' },
  { key: 'CLOSED', label: 'Archived' },
];

const badgeCls: Record<PipelineTab, string> = {
  ALL: 'bg-bg-base text-brand-purple',
  PENDING: 'bg-pending-bg text-pending',
  CONTACTED: 'bg-contacted-bg text-contacted',
  CONVERTED: 'bg-[#EAE7F8] text-brand-purple',
  CLOSED: 'bg-bg-base text-text-secondary/60',
};

export function PipelineTabs({
  active,
  counts,
  onChange,
}: {
  active: PipelineTab;
  counts: TabCounts;
  onChange: (t: PipelineTab) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-6 pt-4 overflow-x-auto bg-bg-base/40 rounded-t-xl">
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-4 py-3 text-sm rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'font-semibold text-brand-purple bg-bg-card shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{t.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${badgeCls[t.key]}`}>{counts[t.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
