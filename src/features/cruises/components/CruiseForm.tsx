import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { destinationsApi } from '@/services/api/destinations'
import { cruiseSchema, type CruiseFormValues } from '../schemas/cruiseSchema'
import type { Cruise } from '../types'

interface CruiseFormProps {
  initialValues?: Cruise
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: CruiseFormValues) => void
}

export function CruiseForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: CruiseFormProps) {
  // Shares the destinations cache key with the package and hotel forms.
  const { data: destinations } = useQuery({
    queryKey: ['destinations', 'options'],
    queryFn: () => destinationsApi.list({ page: 1 }),
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CruiseFormValues>({
    resolver: zodResolver(cruiseSchema),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      cruise_line_ar: initialValues?.cruise_line_ar ?? '',
      cruise_line_en: initialValues?.cruise_line_en ?? '',
      destination_id: initialValues?.destination ? String(initialValues.destination.id) : '',
      departure_port_ar: initialValues?.departure_port_ar ?? '',
      departure_port_en: initialValues?.departure_port_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      departure_date: initialValues?.departure_date ?? '',
      duration_nights: initialValues?.duration_nights ?? 3,
      price_from: initialValues ? Number(initialValues.price_from) : 0,
      cover_image: initialValues?.cover_image ?? '',
      included_services_ar: initialValues?.included_services_ar ?? '',
      included_services_en: initialValues?.included_services_en ?? '',
      is_featured: initialValues?.is_featured ?? false,
      is_active: initialValues?.is_active ?? true,
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Title (Arabic)" htmlFor="title_ar" error={errors.title_ar?.message} required>
          <Input id="title_ar" dir="rtl" hasError={!!errors.title_ar} {...register('title_ar')} />
        </FormField>
        <FormField label="Title (English)" htmlFor="title_en" error={errors.title_en?.message} required>
          <Input id="title_en" hasError={!!errors.title_en} {...register('title_en')} />
        </FormField>

        <FormField label="Cruise line (Arabic)" htmlFor="cruise_line_ar">
          <Input id="cruise_line_ar" dir="rtl" {...register('cruise_line_ar')} />
        </FormField>
        <FormField label="Cruise line (English)" htmlFor="cruise_line_en">
          <Input id="cruise_line_en" {...register('cruise_line_en')} />
        </FormField>

        <FormField label="Destination" htmlFor="destination_id">
          <Select id="destination_id" {...register('destination_id')}>
            <option value="">None</option>
            {destinations?.results.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name_en}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Nights"
          htmlFor="duration_nights"
          error={errors.duration_nights?.message}
          required
          hint="Days are derived as nights + 1 on the website."
        >
          <Input
            id="duration_nights"
            type="number"
            min="1"
            hasError={!!errors.duration_nights}
            {...register('duration_nights', { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="Departure port (Arabic)" htmlFor="departure_port_ar">
          <Input id="departure_port_ar" dir="rtl" {...register('departure_port_ar')} />
        </FormField>
        <FormField label="Departure port (English)" htmlFor="departure_port_en">
          <Input id="departure_port_en" {...register('departure_port_en')} />
        </FormField>

        <FormField label="Price from (SAR)" htmlFor="price_from" error={errors.price_from?.message} required>
          <Input
            id="price_from"
            type="number"
            step="0.01"
            min="0"
            hasError={!!errors.price_from}
            {...register('price_from', { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Cover image URL" htmlFor="cover_image">
          <Controller
            name="cover_image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="cover_image"
                accept="image"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>

        <FormField label="Description (Arabic)" htmlFor="description_ar">
          <Input id="description_ar" dir="rtl" {...register('description_ar')} />
        </FormField>
        <FormField label="Description (English)" htmlFor="description_en">
          <Input id="description_en" {...register('description_en')} />
        </FormField>

        <FormField
          label="Included services (Arabic)"
          htmlFor="included_services_ar"
          hint="One per line — shown as a checklist."
        >
          <Input id="included_services_ar" dir="rtl" {...register('included_services_ar')} />
        </FormField>
        <FormField label="Included services (English)" htmlFor="included_services_en">
          <Input id="included_services_en" {...register('included_services_en')} />
        </FormField>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_featured')} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_active')} />
          Active
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
