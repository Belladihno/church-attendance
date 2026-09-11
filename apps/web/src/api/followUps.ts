import { apiClient } from './client';
import type { Member } from './members';

export type FollowUpStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';

export type FollowUpSubject = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string | null;
  churchRole?: string;
  department?: string | null;
  dateAttended?: string;
};

export type FollowUp = {
  id: string;
  memberId: string | null;
  firstTimerId: string | null;
  member: FollowUpSubject | null;
  firstTimer: FollowUpSubject | null;
  reason: string;
  assignedTo: string | null;
  status: FollowUpStatus;
  contactDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getFollowUps = (params?: Record<string, string | undefined>) =>
  apiClient.get<FollowUp[]>('/follow-ups', { params }).then((r) => r.data);

export const getFollowUp = (id: string) =>
  apiClient.get<FollowUp>(`/follow-ups/${id}`).then((r) => r.data);

export const createFollowUp = (data: Record<string, unknown>) =>
  apiClient.post<FollowUp>('/follow-ups', data).then((r) => r.data);

export const updateFollowUp = (id: string, data: Record<string, unknown>) =>
  apiClient.patch<FollowUp>(`/follow-ups/${id}`, data).then((r) => r.data);

// detectAbsences returns full active Member entities
export type AbsentMember = Member;

export const detectFollowUps = (threshold = 2) =>
  apiClient.get<AbsentMember[]>(`/follow-ups/detect?threshold=${threshold}`).then((r) => r.data);
