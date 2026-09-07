import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import {
  inquiryServiceTypeSchema,
  type InquiryServiceTypeFormValues,
} from '../schemas/inquiryServiceTypeSchema'
import type { InquiryServiceType } from '../types'

interface InquiryServiceTypeFormProps {
  initialValues?: InquiryServiceType
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: InquiryServiceTypeFormValues) => void
}

export function InquiryServiceTypeForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: InquiryServiceTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryServiceTypeFormValues>({
    resolver: zodResolver(inquiryServiceTypeSchema),
    defaultValues: {
      value: initialValues?.value ?? 'FLIGHT',
      label_ar: initialValues?.label_ar ?? '',
      label_en: initialValues?.label_en ?? '',
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
        <FormField
          label="Files enquiries under"
          htmlFor="value"
          error={errors.value?.message}
          required
          hint="Which column the enquiry lands in, and what the Inquiries screen filters by. Best left alone once enquiries are carrying it — rename what visitors see below instead."
        >
          <Select
            id="value"
            hasError={!!errors.value}
            disabled={!!initialValues}
            {...register('value')}
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Order"
          htmlFor="order"
          error={errors.order?.message}
          hint="Lower numbers come first in the list. The first one is what the form opens on."
        >
          <Input
            id="order"
            type="number"
            min="0"
            hasError={!!errors.order}
            {...register('order', { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Shown as (Arabic)"
          htmlFor="label_ar"
          error={errors.label_ar?.message}
          required
        >
          <Input id="label_ar" dir="rtl" hasError={!!errors.label_ar} {...register('label_ar')} />
        </FormField>
        <FormField
          label="Shown as (English)"
          htmlFor="label_en"
          error={errors.label_en?.message}
          required
        >
          <Input id="label_en" hasError={!!errors.label_en} {...register('label_en')} />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_active')} />
        Offered on the contact form
        <span className="text-xs text-stone-500">
          — switch off to stop offering it. Enquiries already filed under it are untouched.
        </span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
