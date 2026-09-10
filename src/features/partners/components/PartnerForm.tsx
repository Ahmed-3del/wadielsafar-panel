import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { partnerSchema, type PartnerFormValues } from '../schemas/partnerSchema'
import type { Partner } from '../types'

interface PartnerFormProps {
  initialValues?: Partner
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: PartnerFormValues) => void
}

export function PartnerForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: PartnerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      logo: initialValues?.logo ?? '',
      website_url: initialValues?.website_url ?? '',
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
          label="Logo"
          htmlFor="logo"
          error={errors.logo?.message}
          hint="Shown on a light background, so a transparent PNG or an SVG-flattened PNG works best."
        >
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="logo"
                accept="image"
                shape="logo"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>

        <FormField
          label="Website"
          htmlFor="website_url"
          error={errors.website_url?.message}
          hint="Optional. Left blank, the logo shows without a link."
        >
          <Input
            id="website_url"
            placeholder="https://…"
            hasError={!!errors.website_url}
            {...register('website_url')}
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
