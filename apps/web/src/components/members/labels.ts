export const DEPARTMENT_LABELS: Record<string, string> = {
  NONE: 'Congregation',
  CHOIR: 'Choir Ministry',
  USHERING: 'Ushering Unit',
  CHILDREN_MINISTRY: 'Children Teachers',
  YOUTH_MINISTRY: 'Youth Fellowship',
  PRAYER_TEAM: 'Prayer & Intercession',
  TECHNICAL: 'Media & Technical',
  WELFARE: 'Welfare Department',
  PROTOCOL: 'Protocol',
  WORKERS_IN_TRAINING: 'Workers in Training',
};

export const CHURCH_ROLE_LABELS: Record<string, string> = {
  MEMBER: 'Member',
  WORKER: 'Worker',
  MEN_LEADER: 'Men Leader',
  WOMEN_LEADER: 'Women Leader',
  YOUTH_LEADER: 'Youth Leader',
  DEACON: 'Deacon',
  DEACONESS: 'Deaconess',
  ASSISTANT_PASTOR: 'Assistant Pastor',
  PASTOR: 'Ordained Minister',
};

export const departmentLabel = (v: string | null | undefined) =>
  DEPARTMENT_LABELS[v ?? 'NONE'] ?? v ?? 'Congregation';

export const churchRoleLabel = (v: string | null | undefined) =>
  CHURCH_ROLE_LABELS[v ?? 'MEMBER'] ?? v ?? 'Member';

export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}
