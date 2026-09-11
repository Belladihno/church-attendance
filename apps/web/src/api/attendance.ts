import { apiClient } from './client';

export const getGrid = (params: { month: number; year: number; serviceType: string; department?: string }) =>
  apiClient.get<{ sundays: string[]; members: { id: string; name: string; dateJoined: string; records: (string | null)[] }[] }>('/attendance/grid', { params }).then((r) => r.data);

export const bulkMark = (data: { date: string; serviceType: string; records: { memberId: string; status: string }[] }) =>
  apiClient.post('/attendance/bulk', data).then((r) => r.data);

export const markAttendance = (data: { memberId: string; date: string; serviceType: string; status: string }) =>
  apiClient.post('/attendance', data).then((r) => r.data);

export const getMemberAttendance = (id: string) =>
  apiClient.get(`/attendance/member/${id}`).then((r) => r.data);
