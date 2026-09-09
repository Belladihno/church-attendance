import { apiClient } from './client';

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  churchRole: string;
  department: string;
  sundaySchoolClass: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  dateJoined: string;
  notes: string | null;
  version: number;
};

export type MembersResponse = { data: Member[]; total: number; page: number; limit: number };

export const getMembers = (params: Record<string, string | number | undefined>) =>
  apiClient.get<MembersResponse>('/members', { params }).then((r) => r.data);

export const getMember = (id: string) =>
  apiClient.get<Member & { attendance: { rate: number; history: unknown[] } }>(`/members/${id}`).then((r) => r.data);

export const createMember = (data: Omit<Member, 'id' | 'version' | 'createdAt' | 'updatedAt'>) =>
  apiClient.post<Member>('/members', data).then((r) => r.data);

export const updateMember = (id: string, data: Partial<Member>) =>
  apiClient.patch<Member>(`/members/${id}`, data).then((r) => r.data);

export const deleteMember = (id: string) =>
  apiClient.delete<Member>(`/members/${id}`).then((r) => r.data);
