import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { visaSchema, type VisaFormValues } from '../schemas/visaSchema'
import { VISA_ENTRY_TYPES, VISA_PURPOSES } from '../types'
import { useCountryOptions } from '../hooks/useCountryOptions'
import type { VisaType } from '../types'

interface VisaFormProps {
  initialValues?: VisaType
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: VisaFormValues) => void
}

export function VisaForm({ initialValues, isSubmitting, submitLabel, onSubmit }: VisaFormProps) {
  const { data: countryOptions } = useCountryOptions()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VisaFormValues>({
    resolver: zodResolver(visaSchema),
    defaultValues: {
      country_id: initialValues?.country ? String(initialValues.country.id) : '',
      purpose: initialValues?.purpose ?? '',
      entry_type: initialValues?.entry_type ?? '',
      cover_image: initialValues?.cover_image ?? '',
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      requirements_ar: initialValues?.requirements_ar ?? '',
      requirements_en: initialValues?.requirements_en ?? '',
      price: initialValues ? Number(initialValues.price) : 0,
      processing_time_days: initialValues?.processing_time_days ?? 1,
      validity_days: initialValues?.validity_days ? String(initialValues.validity_days) : '',
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
        <FormField label="Country" htmlFor="country_id" error={errors.country_id?.message} required>
          <Select id="country_id" hasError={!!errors.country_id} {...register('country_id')}>
            <option value="">Select a country…</option>
            {countryOptions?.results.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name_en}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Purpose"
          htmlFor="purpose"
          error={errors.purpose?.message}
          hint="Drives the homepage visa search. Leave unspecified and it will not answer to any one purpose."
        >
          <Select id="purpose" {...register('purpose')}>
            {VISA_PURPOSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Entry type"
          htmlFor="entry_type"
          error={errors.entry_type?.message}
          hint="Printed on the visa card. Leave unspecified where it depends on the applicant — a wrong answer sends someone to an embassy for nothing."
        >
          <Select id="entry_type" {...register('entry_type')}>
            {VISA_ENTRY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Name (Arabic)" htmlFor="name_ar" error={errors.name_ar?.message} required>
          <Input id="name_ar" dir="rtl" hasError={!!errors.name_ar} {...register('name_ar')} />
        </FormField>
        <FormField label="Name (English)" htmlFor="name_en" error={errors.name_en?.message} required>
          <Input id="name_en" hasError={!!errors.name_en} {...register('name_en')} />
        </FormField>
        <FormField
          label="Requirements (Arabic)"
          htmlFor="requirements_ar"
          error={errors.requirements_ar?.message}
        >
          <Input
            id="requirements_ar"
            dir="rtl"
            hasError={!!errors.requirements_ar}
            {...register('requirements_ar')}
          />
        </FormField>
        <FormField
          label="Requirements (English)"
          htmlFor="requirements_en"
          error={errors.requirements_en?.message}
        >
          <Input
            id="requirements_en"
            hasError={!!errors.requirements_en}
            {...register('requirements_en')}
          />
        </FormField>
        <FormField label="Price (SAR)" htmlFor="price" error={errors.price?.message} required>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            hasError={!!errors.price}
            {...register('price', { valueAsNumber: true })}
          />
        </FormField>
        <FormField
          label="Processing time (days)"
          htmlFor="processing_time_days"
          error={errors.processing_time_days?.message}
          required
        >
          <Input
            id="processing_time_days"
            type="number"
            min="0"
            hasError={!!errors.processing_time_days}
            {...register('processing_time_days', { valueAsNumber: true })}
          />
        </FormField>
        <FormField
          label="Validity (days)"
          htmlFor="validity_days"
          error={errors.validity_days?.message}
          hint="Leave blank if it varies by applicant."
        >
          <Input id="validity_days" type="number" min="0" {...register('validity_days')} />
        </FormField>

        <FormField
          label="Card image"
          htmlFor="cover_image"
          error={errors.cover_image?.message}
          hint="Optional. Leave blank and the card uses the country's own photo — set that once under Visa countries. Fill this in only where one visa needs its own picture, e.g. Makkah for an Umrah visa."
        >
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
                hasError={!!errors.cover_image}
              />
            )}
          />
        </FormField>
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_active')} />
        Active
      </label>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
