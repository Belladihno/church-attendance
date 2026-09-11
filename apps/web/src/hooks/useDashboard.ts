import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../api/dashboard';
import { detectFollowUps } from '../api/followUps';
import { getMemberStats } from '../api/members';

export function useDashboard() {
  const overview = useQuery({ queryKey: ['dashboard-overview'], queryFn: () => getOverview() });
  const followUps = useQuery({ queryKey: ['follow-ups-detect'], queryFn: () => detectFollowUps(2) as Promise<any[]> });
  const memberStats = useQuery({ queryKey: ['members-stats'], queryFn: getMemberStats });
  return { overview, followUps, memberStats };
}
