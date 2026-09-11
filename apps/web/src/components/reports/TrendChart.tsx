import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { SeriesPoint } from '../../api/reports';

export function TrendChart({ series }: { series: SeriesPoint[] }) {
  const peak = series.reduce(
    (best, s) => (s.main > (best?.main ?? -1) ? s : best),
    series[0] as SeriesPoint | undefined,
  );

  return (
    <div className="lg:col-span-2 bg-bg-card rounded-xl p-6 shadow-card flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <h2 className="font-semibold text-text-primary">Weekly Attendance Trend — Last {series.length} Sundays</h2>
          <p className="text-xs text-text-secondary">Comparative curve: Main Service vs. Sunday School registry</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-purple inline-block" />
            <span className="text-text-primary font-medium">Main Service</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5C55A0] inline-block" />
            <span className="text-text-secondary font-medium">Sunday School</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="mainGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2D1B8B" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2D1B8B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ssGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5C55A0" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#5C55A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#F0EBFF" strokeDasharray="4" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#5A5480', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9E99C0', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #DDE1F0', fontSize: 12 }}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as SeriesPoint | undefined;
              return p ? `${p.label} (${p.date})` : '';
            }}
          />
          <Area type="monotone" dataKey="school" name="Sunday School" stroke="#5C55A0" strokeWidth={2.5} fill="url(#ssGrad)" />
          <Area type="monotone" dataKey="main" name="Main Service" stroke="#2D1B8B" strokeWidth={3} fill="url(#mainGrad)" />
        </AreaChart>
      </ResponsiveContainer>
      {peak && (
        <div className="mt-3 text-xs text-text-secondary">
          Peak Main Service: <strong className="text-brand-purple">{peak.main} on {peak.label}</strong>
        </div>
      )}
    </div>
  );
}
