import { apiClient } from './client';

export type SeriesPoint = { date: string; label: string; main: number; school: number };

export type DeptRow = { department: string; enrolled: number; rate: number | null };

export type FlaggedRow = {
  memberId: string;
  name: string;
  phone: string;
  department: string | null;
  churchRole: string;
  streak: number;
  reason: string | null;
  assignedTo: string | null;
  hasOpenTicket: boolean;
};

export type ReportsOverview = {
  totalMembers: number;
  sundayCount: number;
  range: { from: string | null; to: string | null };
  avgAttendance: number;
  avgDeltaPct: number;
  attendanceRate: number;
  participation: number;
  absence: { total: number; twoOnly: number; threePlus: number };
  series: SeriesPoint[];
  breakdown: { mainAvg: number; schoolAvg: number };
  departments: DeptRow[];
  flagged: FlaggedRow[];
};

export const getReportsOverview = () =>
  apiClient.get<ReportsOverview>('/reports/overview').then((r) => r.data);
