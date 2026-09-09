import { apiClient } from './client';

export type DashboardOverview = {
  totalMembers: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
  trend: { previous: number; current: number; delta: number };
  followUpRequired: { twoWeeks: number; threeOrMore: number };
  firstTimersThisMonth: number;
};

export const getOverview = (params?: { month?: number; year?: number }) =>
  apiClient.get<DashboardOverview>('/dashboard/overview', { params }).then((r) => r.data);
