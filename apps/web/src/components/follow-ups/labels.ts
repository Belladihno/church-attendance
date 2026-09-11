import type { FollowUp } from '../../api/followUps';

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONTACTED: 'Contacted',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const statusLabel = (v: string) => STATUS_LABELS[v] ?? v;

export type ReasonCategory = 'absent-3' | 'absent-2' | 'first-timer' | 'welfare' | 'other';

export function reasonCategory(reason: string): ReasonCategory {
  const r = reason.toLowerCase();
  if (r.includes('3+') || r.includes('3 consecutive') || r.includes('three')) return 'absent-3';
  if (r.includes('absent') || r.includes('absence')) return 'absent-2';
  if (r.includes('first timer') || r.includes('first-timer') || r.includes('visitor')) return 'first-timer';
  if (r.includes('welfare')) return 'welfare';
  return 'other';
}

export const REASON_LABELS: Record<ReasonCategory, string> = {
  'absent-3': 'Absent 3+ Sundays',
  'absent-2': 'Absent 2 Sundays',
  'first-timer': 'First timer outreach',
  welfare: 'Welfare check',
  other: 'Other',
};

export function subjectOf(f: FollowUp): { name: string; phone: string; detail: string; kind: 'member' | 'first-timer' | 'unknown' } {
  if (f.member) {
    const m = f.member;
    return {
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone,
      detail: [m.churchRole, m.department].filter(Boolean).join(' — ') || 'Member',
      kind: 'member',
    };
  }
  if (f.firstTimer) {
    const t = f.firstTimer;
    return {
      name: `${t.firstName} ${t.lastName}`,
      phone: t.phone,
      detail: t.dateAttended ? `First timer • ${t.dateAttended}` : 'First timer',
      kind: 'first-timer',
    };
  }
  return { name: 'Unknown subject', phone: '—', detail: '', kind: 'unknown' };
}

export function subjectInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  return `${(parts[0]?.[0] || '').toUpperCase()}${(parts[1]?.[0] || '').toUpperCase()}`;
}

export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export type CareUnit = string; // 'all' | 'FIRST_TIMERS' | Department value

export function unitOf(f: FollowUp): string {
  if (f.member) return f.member.department ?? 'NONE';
  return 'FIRST_TIMERS';
}
