export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending Contact',
  CONTACTED: 'Contacted',
  CONVERTED: 'Converted',
  CLOSED: 'Archived',
};

export const SERVICE_LABELS: Record<string, string> = {
  SUNDAY_SERVICE: 'Main Service',
  SUNDAY_SCHOOL: 'Sunday School',
};

export const statusLabel = (v: string | null | undefined) => STATUS_LABELS[v ?? ''] ?? v ?? '—';

export const serviceLabel = (v: string | null | undefined) => SERVICE_LABELS[v ?? ''] ?? v ?? '—';

export const formatVisitDate = (iso: string) => {
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
