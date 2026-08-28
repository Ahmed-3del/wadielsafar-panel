import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { packageSchema, type PackageFormValues } from '../schemas/packageSchema'
import { useDestinationOptions } from '../hooks/useDestinationOptions'
import { useCategoryOptions } from '../hooks/useCategoryOptions'
import type { Package } from '../types'

interface PackageFormProps {
  initialValues?: Package
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: PackageFormValues) => void
}

export function PackageForm({ initialValues, isSubmitting, submitLabel, onSubmit }: PackageFormProps) {
  const { data: destinationOptions } = useDestinationOptions()
  const { data: categoryOptions } = useCategoryOptions()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      category_id: initialValues?.category ? String(initialValues.category.id) : '',
      destination_id: initialValues?.destination ? String(initialValues.destination.id) : '',
      included_services_ar: initialValues?.included_services_ar ?? '',
      included_services_en: initialValues?.included_services_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      duration_days: initialValues?.duration_days ?? 1,
      price_from: initialValues ? Number(initialValues.price_from) : 0,
      cover_image: initialValues?.cover_image ?? '',
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
        <FormField label="Category" htmlFor="category_id" error={errors.category_id?.message} required>
          <Select id="category_id" hasError={!!errors.category_id} {...register('category_id')}>
            <option value="">Select a category…</option>
            {categoryOptions?.results.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_en}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Destination"
          htmlFor="destination_id"
          error={errors.destination_id?.message}
          required
        >
          <Select id="destination_id" hasError={!!errors.destination_id} {...register('destination_id')}>
            <option value="">Select a destination…</option>
            {destinationOptions?.results.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name_en}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Description (Arabic)"
          htmlFor="description_ar"
          error={errors.description_ar?.message}
        >
          <Input
            id="description_ar"
            dir="rtl"
            hasError={!!errors.description_ar}
            {...register('description_ar')}
          />
        </FormField>
        <FormField
          label="Description (English)"
          htmlFor="description_en"
          error={errors.description_en?.message}
        >
          <Input id="description_en" hasError={!!errors.description_en} {...register('description_en')} />
        </FormField>
        <FormField
          label="Duration (days)"
          htmlFor="duration_days"
          error={errors.duration_days?.message}
          required
        >
          <Input
            id="duration_days"
            type="number"
            min="1"
            hasError={!!errors.duration_days}
            {...register('duration_days', { valueAsNumber: true })}
          />
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
        <FormField
          label="Included services (Arabic)"
          htmlFor="included_services_ar"
          hint="One per line — shown as a checklist on the site."
        >
          <Input id="included_services_ar" dir="rtl" {...register('included_services_ar')} />
        </FormField>
        <FormField label="Included services (English)" htmlFor="included_services_en">
          <Input id="included_services_en" {...register('included_services_en')} />
        </FormField>
        <FormField label="Cover image URL" htmlFor="cover_image" error={errors.cover_image?.message}>
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
