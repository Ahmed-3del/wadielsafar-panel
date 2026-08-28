import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { hotelSchema, type HotelFormValues } from '../schemas/hotelSchema'
import { useAmenityOptions } from '../hooks/useAmenityOptions'
import { useDestinationOptions } from '../hooks/useDestinationOptions'
import { AmenityCheckboxGroup } from './AmenityCheckboxGroup'
import { STAR_RATINGS, type Hotel } from '../types'

interface HotelFormProps {
  initialValues?: Hotel
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: HotelFormValues) => void
}

/** The API returns "HH:MM:SS" but <input type="time"> is bound to "HH:MM". */
function toTimeInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 5) : ''
}

export function HotelForm({ initialValues, isSubmitting, submitLabel, onSubmit }: HotelFormProps) {
  const { data: destinationOptions } = useDestinationOptions()
  const { data: amenityOptions } = useAmenityOptions()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      destination_id: initialValues?.destination ? String(initialValues.destination.id) : '',
      star_rating: initialValues ? String(initialValues.star_rating) : '3',
      address_ar: initialValues?.address_ar ?? '',
      address_en: initialValues?.address_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      amenity_ids: initialValues?.amenities.map((amenity) => String(amenity.id)) ?? [],
      price_per_night_from: initialValues ? Number(initialValues.price_per_night_from) : 0,
      cover_image: initialValues?.cover_image ?? '',
      check_in_time: toTimeInputValue(initialValues?.check_in_time),
      check_out_time: toTimeInputValue(initialValues?.check_out_time),
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
        <FormField label="Name (Arabic)" htmlFor="name_ar" error={errors.name_ar?.message} required>
          <Input id="name_ar" dir="rtl" hasError={!!errors.name_ar} {...register('name_ar')} />
        </FormField>
        <FormField label="Name (English)" htmlFor="name_en" error={errors.name_en?.message} required>
          <Input id="name_en" hasError={!!errors.name_en} {...register('name_en')} />
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
        <FormField label="Star rating" htmlFor="star_rating" error={errors.star_rating?.message} required>
          <Select id="star_rating" hasError={!!errors.star_rating} {...register('star_rating')}>
            {STAR_RATINGS.map((stars) => (
              <option key={stars} value={stars}>
                {stars} star{stars > 1 ? 's' : ''}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Address (Arabic)" htmlFor="address_ar" error={errors.address_ar?.message}>
          <Input id="address_ar" dir="rtl" {...register('address_ar')} />
        </FormField>
        <FormField label="Address (English)" htmlFor="address_en" error={errors.address_en?.message}>
          <Input id="address_en" {...register('address_en')} />
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
          label="Price per night from (SAR)"
          htmlFor="price_per_night_from"
          error={errors.price_per_night_from?.message}
          required
        >
          <Input
            id="price_per_night_from"
            type="number"
            step="0.01"
            min="0"
            hasError={!!errors.price_per_night_from}
            {...register('price_per_night_from', { valueAsNumber: true })}
          />
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
        <FormField label="Check-in time" htmlFor="check_in_time" error={errors.check_in_time?.message}>
          <Input id="check_in_time" type="time" {...register('check_in_time')} />
        </FormField>
        <FormField label="Check-out time" htmlFor="check_out_time" error={errors.check_out_time?.message}>
          <Input id="check_out_time" type="time" {...register('check_out_time')} />
        </FormField>
      </div>
      <FormField label="Amenities" htmlFor="amenity_ids" error={errors.amenity_ids?.message}>
        {/* Controller rather than register(): react-hook-form only infers a value array from a
            checkbox group when more than one box shares the name, and the amenity list is
            data-dependent — a single amenity would silently become a boolean. */}
        <Controller
          control={control}
          name="amenity_ids"
          render={({ field }) => (
            <AmenityCheckboxGroup
              amenities={amenityOptions?.results ?? []}
              selectedIds={field.value}
              onToggle={(id) => {
                field.onChange(
                  field.value.includes(id)
                    ? field.value.filter((current) => current !== id)
                    : [...field.value, id],
                )
              }}
            />
          )}
        />
      </FormField>
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
