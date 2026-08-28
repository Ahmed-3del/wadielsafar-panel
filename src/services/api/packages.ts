import { createCrudApi } from '@/services/api/client'
import type { Package, PackageCategory, PackageWrite } from '@/features/packages/types'

export const packagesApi = createCrudApi<Package, PackageWrite>('packages')
export const packageCategoriesApi = createCrudApi<PackageCategory>('packages/categories')
