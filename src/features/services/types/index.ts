export interface Service {
  id: number
  name_ar: string
  name_en: string
  slug: string
  description_ar: string
  description_en: string
  icon: string
  image: string | null
  order: number
  is_active: boolean
}

export type ServiceWrite = Omit<Service, 'id' | 'slug'>
