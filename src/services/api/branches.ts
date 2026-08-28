import { createCrudApi } from '@/services/api/client'
import type { Branch, BranchWrite } from '@/features/branches/types'

export const branchesApi = createCrudApi<Branch, BranchWrite>('company/branches')
