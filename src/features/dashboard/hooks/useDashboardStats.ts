import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from '../services/dashboardApi'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })
}
