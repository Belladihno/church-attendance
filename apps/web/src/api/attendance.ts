import { apiClient } from './client';

export const getGrid = (params: { month: number; year: number; serviceType: string }) =>
  apiClient.get<{ sundays: string[]; members: { id: string; name: string; records: (string | null)[] }[] }>('/attendance/grid', { params }).then((r) => r.data);

export const bulkMark = (data: { date: string; serviceType: string; records: { memberId: string; status: string }[] }) =>
  apiClient.post('/attendance/bulk', data).then((r) => r.data);

export const getMemberAttendance = (id: string) =>
  apiClient.get(`/attendance/member/${id}`).then((r) => r.data);
