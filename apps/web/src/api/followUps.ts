import { apiClient } from './client';

export const getFollowUps = (params?: Record<string, string | undefined>) =>
  apiClient.get('/follow-ups', { params }).then((r) => r.data);

export const createFollowUp = (data: Record<string, unknown>) =>
  apiClient.post('/follow-ups', data).then((r) => r.data);

export const updateFollowUp = (id: string, data: Record<string, unknown>) =>
  apiClient.patch(`/follow-ups/${id}`, data).then((r) => r.data);

export const detectFollowUps = (threshold = 2) =>
  apiClient.get(`/follow-ups/detect?threshold=${threshold}`).then((r) => r.data);
