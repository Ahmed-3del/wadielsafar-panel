import { createCrudApi } from '@/services/api/client'
import type { Certificate, CertificateWrite } from '@/features/certificates/types'

export const certificatesApi = createCrudApi<Certificate, CertificateWrite>('company/certificates')
