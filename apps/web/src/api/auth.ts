import { apiClient } from './client';

export const login = (email: string, password: string) =>
  apiClient.post<{ access_token: string }>('/auth/login', { email, password }).then((r) => r.data);
