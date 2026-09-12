import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { branchSchema, type BranchFormValues } from '../schemas/branchSchema'
import type { Branch } from '../types'

interface BranchFormProps {
  initialValues?: Branch
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: BranchFormValues) => void
}

export function BranchForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: BranchFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      phone: initialValues?.phone ?? '',
      phone_display: initialValues?.phone_display ?? '',
      address_ar: initialValues?.address_ar ?? '',
      address_en: initialValues?.address_en ?? '',
      cover_image: initialValues?.cover_image ?? '',
      working_hours_ar: initialValues?.working_hours_ar ?? '',
      working_hours_en: initialValues?.working_hours_en ?? '',
      latitude: initialValues?.latitude ?? '',
      longitude: initialValues?.longitude ?? '',
      google_maps_url: initialValues?.google_maps_url ?? '',
      is_main: initialValues?.is_main ?? false,
      order: initialValues?.order ?? 0,
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
          label="Phone"
          htmlFor="phone"
          error={errors.phone?.message}
          required
          hint="What the tap-to-call link dials. No spaces: +966115602558"
        >
          <Input id="phone" dir="ltr" hasError={!!errors.phone} {...register('phone')} />
        </FormField>
        <FormField
          label="Phone as printed"
          htmlFor="phone_display"
          error={errors.phone_display?.message}
          hint="How it reads in the footer, spaces and all. Left blank, the dialled number is shown as-is."
        >
          <Input id="phone_display" dir="ltr" {...register('phone_display')} />
        </FormField>

        <FormField label="Address (Arabic)" htmlFor="address_ar" error={errors.address_ar?.message}>
          <Input id="address_ar" dir="rtl" {...register('address_ar')} />
        </FormField>
        <FormField label="Address (English)" htmlFor="address_en" error={errors.address_en?.message}>
          <Input id="address_en" {...register('address_en')} />
        </FormField>

        <FormField
          label="Cover photo"
          htmlFor="cover_image"
          error={errors.cover_image?.message}
          className="sm:col-span-2"
          hint="A photo of the office — the storefront or the desk. Leave blank and the branch list shows its map preview instead."
        >
          <Controller
            name="cover_image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="cover_image"
                accept="image"
                shape="photo"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!errors.cover_image}
              />
            )}
          />
        </FormField>

        <FormField
          label="Working hours (Arabic)"
          htmlFor="working_hours_ar"
          error={errors.working_hours_ar?.message}
          hint="e.g. السبت – الخميس: ٩ ص – ٩ م. Leave blank to hide this row on the card."
        >
          <Input id="working_hours_ar" dir="rtl" {...register('working_hours_ar')} />
        </FormField>
        <FormField
          label="Working hours (English)"
          htmlFor="working_hours_en"
          error={errors.working_hours_en?.message}
          hint="e.g. Sat–Thu: 9am–9pm."
        >
          <Input id="working_hours_en" dir="ltr" {...register('working_hours_en')} />
        </FormField>

        <FormField
          label="Latitude"
          htmlFor="latitude"
          error={errors.latitude?.message}
          hint="In Google Maps, right-click the branch and click the numbers at the top — latitude first."
        >
          <Input
            id="latitude"
            dir="ltr"
            placeholder="24.693200"
            hasError={!!errors.latitude}
            {...register('latitude')}
          />
        </FormField>
        <FormField
          label="Longitude"
          htmlFor="longitude"
          error={errors.longitude?.message}
          hint="The second number. Leave both blank and the card shows the address without a map."
        >
          <Input
            id="longitude"
            dir="ltr"
            placeholder="46.685400"
            hasError={!!errors.longitude}
            {...register('longitude')}
          />
        </FormField>

        <FormField
          label="Google Maps link"
          htmlFor="google_maps_url"
          error={errors.google_maps_url?.message}
          className="sm:col-span-2"
          hint="Open this branch on Google Maps, tap Share, and paste the link here — that is what lets 'view on map' show its real listing (name, photo, rating) instead of just a pin at its coordinates. Leave blank to search by name and address instead."
        >
          <Input
            id="google_maps_url"
            dir="ltr"
            placeholder="https://maps.app.goo.gl/…"
            hasError={!!errors.google_maps_url}
            {...register('google_maps_url')}
          />
        </FormField>

        <FormField
          label="Order"
          htmlFor="order"
          error={errors.order?.message}
          hint="Lower numbers come first."
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
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_main')} />
        Main branch
        <span className="text-xs text-stone-500">
          — shown first, with a gold border and a badge. Expect exactly one.
        </span>
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
