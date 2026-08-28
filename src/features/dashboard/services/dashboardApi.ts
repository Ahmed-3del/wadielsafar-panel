import { apiClient } from '@/services/api/client'
import type { DashboardStats } from '../types'

/** One staff-only aggregate call; replaces fanning out across every list endpoint for counts. */
export function fetchDashboardStats() {
  return apiClient.get<DashboardStats>('/dashboard/stats/').then((res) => res.data)
}
