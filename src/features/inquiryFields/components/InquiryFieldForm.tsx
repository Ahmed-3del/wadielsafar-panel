import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import {
  inquiryFieldSchema,
  type InquiryFieldFormValues,
} from '../schemas/inquiryFieldSchema'
import { INQUIRY_FIELD_TYPES, type InquiryField } from '../types'

interface InquiryFieldFormProps {
  initialValues?: InquiryField
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: InquiryFieldFormValues) => void
}

export function InquiryFieldForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: InquiryFieldFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFieldFormValues>({
    resolver: zodResolver(inquiryFieldSchema),
    defaultValues: {
      service_type: initialValues?.service_type ?? 'FLIGHT',
      key: initialValues?.key ?? '',
      label_ar: initialValues?.label_ar ?? '',
      label_en: initialValues?.label_en ?? '',
      field_type: initialValues?.field_type ?? 'TEXT',
      placeholder_ar: initialValues?.placeholder_ar ?? '',
      placeholder_en: initialValues?.placeholder_en ?? '',
      options_ar: initialValues?.options_ar ?? '',
      options_en: initialValues?.options_en ?? '',
      is_required: initialValues?.is_required ?? false,
      order: initialValues?.order ?? 0,
      is_active: initialValues?.is_active ?? true,
    },
  })

  // The option boxes only mean anything for a choice field. `useWatch` rather
  // than `watch`: the latter returns a function the React Compiler refuses to
  // memoize, and skips optimising the whole form as a result.
  const needsOptions = useWatch({ control, name: 'field_type' }) === 'SELECT'

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
          label="Asked for"
          htmlFor="service_type"
          error={errors.service_type?.message}
          required
          hint="The website shows this question only when the visitor picks this service."
        >
          <Select id="service_type" hasError={!!errors.service_type} {...register('service_type')}>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Answer key"
          htmlFor="key"
          error={errors.key?.message}
          required
          hint="How the answer is filed on the enquiry, e.g. check_in. Lower case, no spaces — and best left alone once enquiries are carrying it."
        >
          <Input id="key" dir="ltr" hasError={!!errors.key} {...register('key')} />
        </FormField>

        <FormField label="Label (Arabic)" htmlFor="label_ar" error={errors.label_ar?.message} required>
          <Input id="label_ar" dir="rtl" hasError={!!errors.label_ar} {...register('label_ar')} />
        </FormField>
        <FormField label="Label (English)" htmlFor="label_en" error={errors.label_en?.message} required>
          <Input id="label_en" hasError={!!errors.label_en} {...register('label_en')} />
        </FormField>

        <FormField
          label="Answer type"
          htmlFor="field_type"
          error={errors.field_type?.message}
          required
          hint="What the website draws: a text box, a number, a date picker or a list to choose from."
        >
          <Select id="field_type" hasError={!!errors.field_type} {...register('field_type')}>
            {INQUIRY_FIELD_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Order"
          htmlFor="order"
          error={errors.order?.message}
          hint="Lower numbers come first within this service."
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
          label="Placeholder (Arabic)"
          htmlFor="placeholder_ar"
          error={errors.placeholder_ar?.message}
          hint="Optional grey hint inside the box."
        >
          <Input id="placeholder_ar" dir="rtl" {...register('placeholder_ar')} />
        </FormField>
        <FormField
          label="Placeholder (English)"
          htmlFor="placeholder_en"
          error={errors.placeholder_en?.message}
        >
          <Input id="placeholder_en" {...register('placeholder_en')} />
        </FormField>

        {needsOptions ? (
          <>
            <FormField
              label="Options (Arabic)"
              htmlFor="options_ar"
              error={errors.options_ar?.message}
              required
              hint="One per line, in the same order as the English list."
            >
              <textarea
                id="options_ar"
                dir="rtl"
                rows={4}
                className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-navy-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                {...register('options_ar')}
              />
            </FormField>
            <FormField
              label="Options (English)"
              htmlFor="options_en"
              error={errors.options_en?.message}
              required
              hint="One per line. Both lists must have the same number of lines — the website pairs them up by position."
            >
              <textarea
                id="options_en"
                rows={4}
                className="block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-navy-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                {...register('options_en')}
              />
            </FormField>
          </>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_required')} />
        Required
        <span className="text-xs text-stone-500">— the visitor cannot send the form without it.</span>
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
