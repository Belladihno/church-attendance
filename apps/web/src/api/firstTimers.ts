import { apiClient } from './client';

export type FirstTimerFollowUpStatus = 'PENDING' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';

export type FirstTimer = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  address: string | null;
  dateAttended: string;
  serviceAttended: 'SUNDAY_SERVICE' | 'SUNDAY_SCHOOL';
  invitedBy: string | null;
  howHeard: string | null;
  followUpStatus: FirstTimerFollowUpStatus;
  followUpNotes: string | null;
  convertedToId: string | null;
  version: number;
};

export const getFirstTimers = (params?: Record<string, string | undefined>) =>
  apiClient.get<FirstTimer[]>('/first-timers', { params }).then((r) => r.data);

export const getFirstTimer = (id: string) =>
  apiClient.get<FirstTimer>(`/first-timers/${id}`).then((r) => r.data);

export const createFirstTimer = (data: Record<string, unknown>) =>
  apiClient.post<FirstTimer>('/first-timers', data).then((r) => r.data);

export const updateFirstTimer = (id: string, data: Record<string, unknown>) =>
  apiClient.patch<FirstTimer>(`/first-timers/${id}`, data).then((r) => r.data);

export const convertToMember = (id: string, data: Record<string, unknown> = {}) =>
  apiClient.post(`/first-timers/${id}/convert`, data).then((r) => r.data);
