import { createCrudApi } from '@/services/api/client'
import type { SocialLink, SocialLinkWrite } from '@/features/socialLinks/types'

export const socialLinksApi = createCrudApi<SocialLink, SocialLinkWrite>('company/social-links')
