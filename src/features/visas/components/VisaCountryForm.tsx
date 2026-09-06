import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { CountryField } from '@/components/forms/CountryField'
import { flagUrl } from '@/constants/countries'
import { visaCountrySchema, type VisaCountryFormValues } from '../schemas/visaCountrySchema'
import type { VisaCountry } from '../types'

interface VisaCountryFormProps {
  initialValues?: VisaCountry
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: VisaCountryFormValues) => void
}

export function VisaCountryForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: VisaCountryFormProps) {
  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<VisaCountryFormValues>({
    resolver: zodResolver(visaCountrySchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      flag_image: initialValues?.flag_image ?? '',
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
        <FormField
          label="Country"
          htmlFor="name_en"
          error={errors.name_en?.message ?? errors.name_ar?.message}
          required
          hint="Search and pick — the Arabic name and the flag fill themselves in. Type freely for anything the list has not got."
        >
          <Controller
            name="name_en"
            control={control}
            render={({ field }) => (
              <CountryField
                id="name_en"
                value={field.value}
                onBlur={field.onBlur}
                hasError={!!errors.name_en || !!errors.name_ar}
                onType={field.onChange}
                onPick={(country) => {
                  field.onChange(country.name_en)
                  setValue('name_ar', country.name_ar, { shouldValidate: true })
                  // Only fills an empty flag: an editor who uploaded their own
                  // should not have it replaced by picking the country again.
                  if (!getValues('flag_image').trim()) {
                    setValue('flag_image', flagUrl(country.iso2, 160))
                  }
                }}
              />
            )}
          />
        </FormField>

        <FormField
          label="Name (Arabic)"
          htmlFor="name_ar"
          error={errors.name_ar?.message}
          required
          hint="Filled in by the picker above."
        >
          <Input id="name_ar" dir="rtl" hasError={!!errors.name_ar} {...register('name_ar')} />
        </FormField>

        <FormField
          label="Country photo"
          htmlFor="cover_image"
          error={errors.cover_image?.message}
          hint="Heads every visa card for this country — a photograph of the place, not the flag. Left blank, those cards show a plain brand block."
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

        <FormField
          label="Flag"
          htmlFor="flag_image"
          error={errors.flag_image?.message}
          hint="The small flag used in the visa search filters."
        >
          <Controller
            name="flag_image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="flag_image"
                accept="image"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!errors.flag_image}
              />
            )}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-stone-300"
          {...register('is_active')}
        />
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
