import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { CountryField } from '@/components/forms/CountryField'
import { destinationSchema, type DestinationFormValues } from '../schemas/destinationSchema'
import type { Destination } from '../types'

interface DestinationFormProps {
  initialValues?: Destination
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: DestinationFormValues) => void
}

export function DestinationForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: DestinationFormProps) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      country_ar: initialValues?.country_ar ?? '',
      country_en: initialValues?.country_en ?? '',
      cover_image: initialValues?.cover_image ?? '',
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
        <FormField label="Name (Arabic)" htmlFor="name_ar" error={errors.name_ar?.message} required>
          <Input id="name_ar" dir="rtl" hasError={!!errors.name_ar} {...register('name_ar')} />
        </FormField>
        <FormField label="Name (English)" htmlFor="name_en" error={errors.name_en?.message} required>
          <Input id="name_en" hasError={!!errors.name_en} {...register('name_en')} />
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
          label="Country"
          htmlFor="country_en"
          error={errors.country_en?.message ?? errors.country_ar?.message}
          required
          hint="Search and pick — the Arabic name fills itself in. Type freely if the country is not listed."
        >
          <Controller
            name="country_en"
            control={control}
            render={({ field }) => (
              <CountryField
                id="country_en"
                value={field.value}
                onBlur={field.onBlur}
                hasError={!!errors.country_en || !!errors.country_ar}
                onType={field.onChange}
                onPick={(country) => {
                  field.onChange(country.name_en)
                  setValue('country_ar', country.name_ar, { shouldValidate: true })
                }}
              />
            )}
          />
        </FormField>

        <FormField
          label="Country (Arabic)"
          htmlFor="country_ar"
          error={errors.country_ar?.message}
          required
          hint="Filled in by the picker above."
        >
          <Input id="country_ar" dir="rtl" hasError={!!errors.country_ar} {...register('country_ar')} />
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
