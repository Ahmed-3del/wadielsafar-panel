import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { AirportField } from '@/components/forms/AirportField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { flightSchema, type FlightFormValues } from '../schemas/flightSchema'
import { CABIN_CLASSES, TRIP_TYPES, type FlightDeal } from '../types'

interface FlightFormProps {
  initialValues?: FlightDeal
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: FlightFormValues) => void
}

export function FlightForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: FlightFormProps) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      origin_city_ar: initialValues?.origin_city_ar ?? '',
      origin_city_en: initialValues?.origin_city_en ?? '',
      origin_airport_code: initialValues?.origin_airport_code ?? '',
      destination_city_ar: initialValues?.destination_city_ar ?? '',
      destination_city_en: initialValues?.destination_city_en ?? '',
      destination_airport_code: initialValues?.destination_airport_code ?? '',
      airline_name_ar: initialValues?.airline_name_ar ?? '',
      airline_name_en: initialValues?.airline_name_en ?? '',
      airline_logo: initialValues?.airline_logo ?? '',
      trip_type: initialValues?.trip_type ?? 'ROUND_TRIP',
      cabin_class: initialValues?.cabin_class ?? 'ECONOMY',
      price_from: initialValues ? Number(initialValues.price_from) : 0,
      departure_date: initialValues?.departure_date ?? '',
      return_date: initialValues?.return_date ?? '',
      baggage_allowance_kg:
        initialValues?.baggage_allowance_kg != null ? String(initialValues.baggage_allowance_kg) : '',
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
          label="Origin city (Arabic)"
          htmlFor="origin_city_ar"
          error={errors.origin_city_ar?.message}
          required
        >
          <Input
            id="origin_city_ar"
            dir="rtl"
            hasError={!!errors.origin_city_ar}
            {...register('origin_city_ar')}
          />
        </FormField>
        <FormField
          label="Origin city (English)"
          htmlFor="origin_city_en"
          error={errors.origin_city_en?.message}
          required
        >
          <Input
            id="origin_city_en"
            hasError={!!errors.origin_city_en}
            {...register('origin_city_en')}
          />
        </FormField>
        <FormField
          label="Origin airport"
          htmlFor="origin_airport_code"
          error={errors.origin_airport_code?.message}
          required
          hint="Search the airport catalogue — the city names above fill themselves in. A code typed by hand still saves, for an airport not in the list yet."
        >
          <Controller
            name="origin_airport_code"
            control={control}
            render={({ field }) => (
              <AirportField
                id="origin_airport_code"
                value={field.value}
                onBlur={field.onBlur}
                hasError={!!errors.origin_airport_code}
                onType={field.onChange}
                onPick={(airport) => {
                  field.onChange(airport.iata_code)
                  setValue('origin_city_ar', airport.city_ar, { shouldValidate: true })
                  setValue('origin_city_en', airport.city_en, { shouldValidate: true })
                }}
              />
            )}
          />
        </FormField>
        <FormField
          label="Destination airport"
          htmlFor="destination_airport_code"
          error={errors.destination_airport_code?.message}
          required
          hint="Search the airport catalogue — the city names below fill themselves in."
        >
          <Controller
            name="destination_airport_code"
            control={control}
            render={({ field }) => (
              <AirportField
                id="destination_airport_code"
                value={field.value}
                onBlur={field.onBlur}
                hasError={!!errors.destination_airport_code}
                onType={field.onChange}
                onPick={(airport) => {
                  field.onChange(airport.iata_code)
                  setValue('destination_city_ar', airport.city_ar, { shouldValidate: true })
                  setValue('destination_city_en', airport.city_en, { shouldValidate: true })
                }}
              />
            )}
          />
        </FormField>
        <FormField
          label="Destination city (Arabic)"
          htmlFor="destination_city_ar"
          error={errors.destination_city_ar?.message}
          required
        >
          <Input
            id="destination_city_ar"
            dir="rtl"
            hasError={!!errors.destination_city_ar}
            {...register('destination_city_ar')}
          />
        </FormField>
        <FormField
          label="Destination city (English)"
          htmlFor="destination_city_en"
          error={errors.destination_city_en?.message}
          required
        >
          <Input
            id="destination_city_en"
            hasError={!!errors.destination_city_en}
            {...register('destination_city_en')}
          />
        </FormField>

        <FormField
          label="Airline (Arabic)"
          htmlFor="airline_name_ar"
          error={errors.airline_name_ar?.message}
        >
          <Input id="airline_name_ar" dir="rtl" {...register('airline_name_ar')} />
        </FormField>
        <FormField
          label="Airline (English)"
          htmlFor="airline_name_en"
          error={errors.airline_name_en?.message}
        >
          <Input id="airline_name_en" {...register('airline_name_en')} />
        </FormField>
        <FormField label="Airline logo URL" htmlFor="airline_logo" error={errors.airline_logo?.message}>
          <Controller
            name="airline_logo"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="airline_logo"
                accept="image"
                shape="logo"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>

        <FormField label="Trip type" htmlFor="trip_type" error={errors.trip_type?.message} required>
          <Select id="trip_type" hasError={!!errors.trip_type} {...register('trip_type')}>
            {TRIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Cabin class" htmlFor="cabin_class" error={errors.cabin_class?.message} required>
          <Select id="cabin_class" hasError={!!errors.cabin_class} {...register('cabin_class')}>
            {CABIN_CLASSES.map((cabin) => (
              <option key={cabin} value={cabin}>
                {cabin}
              </option>
            ))}
          </Select>
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
          label="Baggage allowance (kg)"
          htmlFor="baggage_allowance_kg"
          error={errors.baggage_allowance_kg?.message}
        >
          <Input
            id="baggage_allowance_kg"
            type="number"
            min="0"
            hasError={!!errors.baggage_allowance_kg}
            {...register('baggage_allowance_kg')}
          />
        </FormField>
        <FormField
          label="Departure date"
          htmlFor="departure_date"
          error={errors.departure_date?.message}
        >
          <Input id="departure_date" type="date" {...register('departure_date')} />
        </FormField>
        <FormField label="Return date" htmlFor="return_date" error={errors.return_date?.message}>
          <Input
            id="return_date"
            type="date"
            hasError={!!errors.return_date}
            {...register('return_date')}
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
