import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getReportsOverview } from '../api/reports';
import { createFollowUp } from '../api/followUps';
import { ReportHeader } from '../components/reports/ReportHeader';
import { KpiCards } from '../components/reports/KpiCards';
import { TrendChart } from '../components/reports/TrendChart';
import { ServiceDonut } from '../components/reports/ServiceDonut';
import { DeptTable } from '../components/reports/DeptTable';
import { DiagnosticTable } from '../components/reports/DiagnosticTable';
import { departmentLabel } from '../components/members/labels';

export function ReportsPage() {
  const qc = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reports-overview'],
    queryFn: getReportsOverview,
  });

  const fmt = (iso: string | null) =>
    iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const periodLabel = data ? `Last ${data.sundayCount} Sundays: ${fmt(data.range.from)} – ${fmt(data.range.to)}` : 'Loading...';

  const onExport = () => {
    if (!data) return;
    setExporting(true);
    try {
      const lines = ['# Weekly series'];
      lines.push('Date,Label,Main Service,Sunday School');
      for (const s of data.series) lines.push(`${s.date},${s.label},${s.main},${s.school}`);
      lines.push('', '# Departments');
      lines.push('Department,Enrolled,Rate %');
      for (const d of data.departments) lines.push(`${departmentLabel(d.department)},${d.enrolled},${d.rate === null ? '' : d.rate.toFixed(1)}`);
      lines.push('', '# Flagged absences');
      lines.push('Name,Phone,Department,Streak,Reason,Assigned');
      const esc = (s: string | null) => `"${(s || '').replace(/"/g, '""')}"`;
      for (const f of data.flagged) lines.push(`${esc(f.name)},${f.phone},${departmentLabel(f.department)},${f.streak},${esc(f.reason)},${esc(f.assignedTo)}`);
      const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance-summary.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const onAssignBatch = async () => {
    if (!data) return;
    setAssigning(true);
    setBanner(null);
    try {
      const pending = data.flagged.filter((f) => !f.hasOpenTicket);
      let created = 0;
      for (const f of pending) {
        // eslint-disable-next-line no-await-in-loop
        await createFollowUp({
          memberId: f.memberId,
          reason: `Absent ${f.streak} consecutive Sundays`,
          status: 'PENDING',
        });
        created++;
      }
      setBanner(
        created === 0
          ? 'Everyone flagged already has an open care record.'
          : `Assigned ${created} care ticket${created === 1 ? '' : 's'} to the pastoral queue. See Follow-ups.`,
      );
      qc.invalidateQueries({ queryKey: ['reports-overview'] });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ReportHeader periodLabel={periodLabel} onExport={onExport} exporting={exporting} />

      {banner && (
        <div className="bg-[#EAE7F8] text-brand-purple text-sm rounded-lg px-4 py-2.5">{banner}</div>
      )}

      {isLoading || !data ? (
        <div className="text-center p-8 text-text-secondary">Loading analytics...</div>
      ) : (
        <>
          <KpiCards data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TrendChart series={data.series} />
            <ServiceDonut mainAvg={data.breakdown.mainAvg} schoolAvg={data.breakdown.schoolAvg} />
          </div>
          <DeptTable departments={data.departments} />
          <DiagnosticTable flagged={data.flagged} onAssignBatch={onAssignBatch} assigning={assigning} />
        </>
      )}
    </div>
  );
}
