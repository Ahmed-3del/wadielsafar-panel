import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { CountryField } from '@/components/forms/CountryField'
import { airportSchema, type AirportFormValues } from '../schemas/airportSchema'
import type { Airport } from '../types'

interface AirportFormProps {
  initialValues?: Airport
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: AirportFormValues) => void
}

export function AirportForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: AirportFormProps) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      iata_code: initialValues?.iata_code ?? '',
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      city_ar: initialValues?.city_ar ?? '',
      city_en: initialValues?.city_en ?? '',
      country_ar: initialValues?.country_ar ?? '',
      country_en: initialValues?.country_en ?? '',
      country_code: initialValues?.country_code ?? '',
      is_popular: initialValues?.is_popular ?? false,
      is_active: initialValues?.is_active ?? true,
      order: initialValues?.order ?? 0,
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
          label="IATA code"
          htmlFor="iata_code"
          error={errors.iata_code?.message}
          required
          hint="Three letters. Saved upper case whatever you type."
        >
          <Input
            id="iata_code"
            dir="ltr"
            maxLength={3}
            className="uppercase"
            hasError={!!errors.iata_code}
            {...register('iata_code')}
          />
        </FormField>

        <FormField
          label="Country code"
          htmlFor="country_code"
          error={errors.country_code?.message}
          hint="Two letters, e.g. SA. Draws the flag beside the airport in the picker."
        >
          <Input
            id="country_code"
            dir="ltr"
            maxLength={2}
            className="uppercase"
            hasError={!!errors.country_code}
            {...register('country_code')}
          />
        </FormField>

        <FormField label="City (Arabic)" htmlFor="city_ar" error={errors.city_ar?.message} required>
          <Input id="city_ar" dir="rtl" hasError={!!errors.city_ar} {...register('city_ar')} />
        </FormField>
        <FormField label="City (English)" htmlFor="city_en" error={errors.city_en?.message} required>
          <Input id="city_en" hasError={!!errors.city_en} {...register('city_en')} />
        </FormField>

        <FormField
          label="Airport name (Arabic)"
          htmlFor="name_ar"
          error={errors.name_ar?.message}
          required
        >
          <Input id="name_ar" dir="rtl" hasError={!!errors.name_ar} {...register('name_ar')} />
        </FormField>
        <FormField
          label="Airport name (English)"
          htmlFor="name_en"
          error={errors.name_en?.message}
          required
        >
          <Input id="name_en" hasError={!!errors.name_en} {...register('name_en')} />
        </FormField>

        <FormField
          label="Country"
          htmlFor="country_en"
          error={errors.country_en?.message ?? errors.country_ar?.message}
          required
          hint="Search and pick — the Arabic name and the two-letter code fill themselves in. Type freely if the country is not listed."
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
                  setValue('country_code', country.iso2, { shouldValidate: true })
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
          hint="Filled in by the picker above; edit only if this airport's country needs a different wording."
        >
          <Input id="country_ar" dir="rtl" hasError={!!errors.country_ar} {...register('country_ar')} />
        </FormField>

        <FormField
          label="Order"
          htmlFor="order"
          error={errors.order?.message}
          hint="Lower numbers come first among the suggestions."
        >
          <Input
            id="order"
            type="number"
            min="0"
            hasError={!!errors.order}
            {...register('order', { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_popular')} />
        Suggest before the traveller types
      </label>

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
