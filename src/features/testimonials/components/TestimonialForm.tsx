import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { testimonialSchema, type TestimonialFormValues } from '../schemas/testimonialSchema'
import { RATINGS, type Testimonial } from '../types'

interface TestimonialFormProps {
  initialValues?: Testimonial
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: TestimonialFormValues) => void
}

export function TestimonialForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: TestimonialFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      customer_name: initialValues?.customer_name ?? '',
      customer_title_ar: initialValues?.customer_title_ar ?? '',
      customer_title_en: initialValues?.customer_title_en ?? '',
      content_ar: initialValues?.content_ar ?? '',
      content_en: initialValues?.content_en ?? '',
      rating: String(initialValues?.rating ?? 5),
      avatar_image: initialValues?.avatar_image ?? '',
      service_type: initialValues?.service_type ?? '',
      is_visible: initialValues?.is_visible ?? true,
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
          label="Customer name"
          htmlFor="customer_name"
          error={errors.customer_name?.message}
          required
        >
          <Input
            id="customer_name"
            hasError={!!errors.customer_name}
            {...register('customer_name')}
          />
        </FormField>
        <FormField label="Rating" htmlFor="rating" error={errors.rating?.message} required>
          <Select id="rating" hasError={!!errors.rating} {...register('rating')}>
            {RATINGS.map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating > 1 ? 's' : ''}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Customer title (Arabic)"
          htmlFor="customer_title_ar"
          error={errors.customer_title_ar?.message}
        >
          <Input id="customer_title_ar" dir="rtl" {...register('customer_title_ar')} />
        </FormField>
        <FormField
          label="Customer title (English)"
          htmlFor="customer_title_en"
          error={errors.customer_title_en?.message}
        >
          <Input id="customer_title_en" {...register('customer_title_en')} />
        </FormField>
        <FormField
          label="Content (Arabic)"
          htmlFor="content_ar"
          error={errors.content_ar?.message}
          required
        >
          <Input id="content_ar" dir="rtl" hasError={!!errors.content_ar} {...register('content_ar')} />
        </FormField>
        <FormField
          label="Content (English)"
          htmlFor="content_en"
          error={errors.content_en?.message}
          required
        >
          <Input id="content_en" hasError={!!errors.content_en} {...register('content_en')} />
        </FormField>
        <FormField label="Service type" htmlFor="service_type" error={errors.service_type?.message}>
          <Select id="service_type" hasError={!!errors.service_type} {...register('service_type')}>
            <option value="">No specific service</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Avatar image URL" htmlFor="avatar_image" error={errors.avatar_image?.message}>
          <Controller
            name="avatar_image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="avatar_image"
                accept="image"
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
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_visible')} />
          Visible
        </label>
      </div>
      {initialValues && !initialValues.is_approved && (
        <p className="text-sm text-stone-500">
          This testimonial is still pending approval — approve it from the list to publish it.
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
