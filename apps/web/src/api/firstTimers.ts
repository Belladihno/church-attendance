import { apiClient } from './client';

export const getFirstTimers = (params?: Record<string, string | undefined>) =>
  apiClient.get('/first-timers', { params }).then((r) => r.data);

export const createFirstTimer = (data: Record<string, unknown>) =>
  apiClient.post('/first-timers', data).then((r) => r.data);

export const convertToMember = (id: string, data: Record<string, unknown> = {}) =>
  apiClient.post(`/first-timers/${id}/convert`, data).then((r) => r.data);
