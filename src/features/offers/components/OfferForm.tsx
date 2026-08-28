import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { offerSchema, type OfferFormValues } from '../schemas/offerSchema'
import type { Offer } from '../types'

interface OfferFormProps {
  initialValues?: Offer
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: OfferFormValues) => void
}

export function OfferForm({ initialValues, isSubmitting, submitLabel, onSubmit }: OfferFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      service_type: initialValues?.service_type ?? 'PACKAGE',
      price_before: initialValues?.price_before ?? '',
      price_after: initialValues?.price_after ?? '',
      image: initialValues?.image ?? '',
      starts_at: initialValues?.starts_at ?? '',
      ends_at: initialValues?.ends_at ?? '',
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
        <FormField
          label="Description (Arabic)"
          htmlFor="description_ar"
          error={errors.description_ar?.message}
        >
          <Input id="description_ar" dir="rtl" {...register('description_ar')} />
        </FormField>
        <FormField
          label="Description (English)"
          htmlFor="description_en"
          error={errors.description_en?.message}
        >
          <Input id="description_en" {...register('description_en')} />
        </FormField>
        <FormField
          label="Service type"
          htmlFor="service_type"
          error={errors.service_type?.message}
          required
        >
          <Select id="service_type" hasError={!!errors.service_type} {...register('service_type')}>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Image URL" htmlFor="image" error={errors.image?.message}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="image"
                accept="image"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>
        <FormField
          label="Price before (SAR)"
          htmlFor="price_before"
          error={errors.price_before?.message}
        >
          <Input
            id="price_before"
            type="number"
            step="0.01"
            min="0"
            hasError={!!errors.price_before}
            {...register('price_before')}
          />
        </FormField>
        <FormField label="Price after (SAR)" htmlFor="price_after" error={errors.price_after?.message}>
          <Input
            id="price_after"
            type="number"
            step="0.01"
            min="0"
            hasError={!!errors.price_after}
            {...register('price_after')}
          />
        </FormField>
        <FormField label="Starts at" htmlFor="starts_at" error={errors.starts_at?.message} required>
          <Input
            id="starts_at"
            type="date"
            hasError={!!errors.starts_at}
            {...register('starts_at')}
          />
        </FormField>
        <FormField label="Ends at" htmlFor="ends_at" error={errors.ends_at?.message} required>
          <Input id="ends_at" type="date" hasError={!!errors.ends_at} {...register('ends_at')} />
        </FormField>
      </div>
      {initialValues && (
        <p className="text-sm text-stone-500">
          Status and discount are computed by the backend from the prices and validity window:
          currently <strong>{initialValues.status}</strong>
          {initialValues.discount_percentage !== null && ` · ${initialValues.discount_percentage}% off`}.
        </p>
      )}
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
