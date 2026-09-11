import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export function ServiceDonut({ mainAvg, schoolAvg }: { mainAvg: number; schoolAvg: number }) {
  const total = mainAvg + schoolAvg;
  const mainPct = total > 0 ? (mainAvg / total) * 100 : 0;
  const schoolPct = total > 0 ? (schoolAvg / total) * 100 : 0;
  const data = [
    { name: 'Sunday Worship', value: Math.round(mainAvg * 10) / 10, color: '#2D1B8B' },
    { name: 'Sunday School', value: Math.round(schoolAvg * 10) / 10, color: '#5C55A0' },
  ];

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-semibold text-text-primary">Service Breakdown</h2>
          <span className="text-[11px] px-2 py-0.5 rounded bg-bg-base text-text-secondary">Distribution</span>
        </div>
        <p className="text-xs text-text-secondary mb-2">Aggregate participation ratio, last 8 Sundays</p>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} strokeWidth={0} paddingAngle={2}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: unknown, name: unknown) => [`${String(value)} avg`, String(name ?? '')]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-bg-base/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
            <span className="text-[13px] text-text-primary">Sunday Worship</span>
          </div>
          <div className="text-xs">
            <span className="font-bold text-text-primary">{mainPct.toFixed(0)}%</span>{' '}
            <span className="text-text-secondary/60">(avg {mainAvg})</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-bg-base/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5C55A0]" />
            <span className="text-[13px] text-text-primary">Sunday School</span>
          </div>
          <div className="text-xs">
            <span className="font-bold text-text-primary">{schoolPct.toFixed(0)}%</span>{' '}
            <span className="text-text-secondary/60">(avg {schoolAvg})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
