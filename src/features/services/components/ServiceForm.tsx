import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { serviceSchema, type ServiceFormValues } from '../schemas/serviceSchema'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { SERVICE_ICONS, type Service } from '../types'

interface ServiceFormProps {
  initialValues?: Service
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: ServiceFormValues) => void
}

export function ServiceForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: ServiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      icon: initialValues?.icon ?? '',
      link: initialValues?.link ?? '',
      service_type: initialValues?.service_type ?? '',
      is_on_contact_form: initialValues?.is_on_contact_form ?? false,
      image: initialValues?.image ?? '',
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
          label="Icon"
          htmlFor="icon"
          error={errors.icon?.message}
          hint="The mark the website draws on this tile. Every option here is one the site can actually draw."
        >
          <Select id="icon" hasError={!!errors.icon} {...register('icon')}>
            <option value="">Default (ticket)</option>
            {SERVICE_ICONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Links to"
          htmlFor="link"
          error={errors.link?.message}
          hint="A path on this site, e.g. /visas. Leave blank and the tile opens the contact form, which is right for anything an agent arranges by hand."
        >
          <Input id="link" dir="ltr" placeholder="/visas" hasError={!!errors.link} {...register('link')} />
        </FormField>

        <FormField
          label="Files enquiries under"
          htmlFor="service_type"
          error={errors.service_type?.message}
          hint="Which column an enquiry for this service lands in, and what the Inquiries screen filters by. Most add-ons are Other — that is what it is for."
        >
          <Select id="service_type" hasError={!!errors.service_type} {...register('service_type')}>
            <option value="">Leave the form on its default</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
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
                shape="photo"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>
        <FormField label="Order" htmlFor="order" error={errors.order?.message} required>
          <Input
            id="order"
            type="number"
            min="0"
            hasError={!!errors.order}
            {...register('order', { valueAsNumber: true })}
          />
        </FormField>
      </div>
      <label className="flex items-start gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-stone-300"
          {...register('is_on_contact_form')}
        />
        <span>
          Offer this on the contact form
          <span className="block text-xs text-stone-500">
            It appears in the website&apos;s &ldquo;Service needed&rdquo; list by name, so nobody
            has to pick &ldquo;Other&rdquo;. Once it is on, you can give it its own questions under
            Contact form questions.
          </span>
        </span>
      </label>

      <div className="flex gap-6">
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
