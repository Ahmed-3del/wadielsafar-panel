import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { useServiceOptions } from '@/features/services'
import {
  inquiryFieldSchema,
  type InquiryFieldFormValues,
} from '../schemas/inquiryFieldSchema'
import { INQUIRY_FIELD_TYPES, OPTION_TYPES, type InquiryField } from '../types'

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
      service: initialValues?.service ?? null,
      key: initialValues?.key ?? '',
      label_ar: initialValues?.label_ar ?? '',
      label_en: initialValues?.label_en ?? '',
      field_type: initialValues?.field_type ?? 'TEXT',
      placeholder_ar: initialValues?.placeholder_ar ?? '',
      placeholder_en: initialValues?.placeholder_en ?? '',
      options_ar: initialValues?.options_ar ?? '',
      options_en: initialValues?.options_en ?? '',
      is_required: initialValues?.is_required ?? false,
      min_value: initialValues?.min_value ?? null,
      max_value: initialValues?.max_value ?? null,
      not_past: initialValues?.not_past ?? false,
      not_before: initialValues?.not_before ?? '',
      show_when_key: initialValues?.show_when_key ?? '',
      show_when_value: initialValues?.show_when_value ?? '',
      is_wide: initialValues?.is_wide ?? false,
      group_ar: initialValues?.group_ar ?? '',
      group_en: initialValues?.group_en ?? '',
      order: initialValues?.order ?? 0,
      is_active: initialValues?.is_active ?? true,
    },
  })

  const { data: services } = useServiceOptions()

  // `useWatch` rather than `watch`: the latter returns a function the React
  // Compiler refuses to memoize, and skips optimising the whole form.
  const fieldType = useWatch({ control, name: 'field_type' })
  // A question belongs to one service, or to a whole service type. Asking for
  // both would put the same question on the form twice.
  const attachedToService = !!useWatch({ control, name: 'service' })
  // The options only mean anything where a list is shown, and the bounds only
  // where there is a count.
  const needsOptions = OPTION_TYPES.includes(fieldType as (typeof OPTION_TYPES)[number])
  const needsBounds = fieldType === 'STEPPER' || fieldType === 'NUMBER'
  const isDate = fieldType === 'DATE'

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
          label="Asked for one service"
          htmlFor="service"
          error={errors.service?.message}
          hint="A service from the Services screen — its own question, asked of nobody else. Leave blank to ask it of a whole service type instead."
        >
          <Select
            id="service"
            hasError={!!errors.service}
            {...register('service', {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
          >
            <option value="">— a service type instead —</option>
            {(services ?? []).map((service) => (
              <option key={service.id} value={service.id}>
                {service.name_en}
                {service.is_on_contact_form ? '' : ' (not on the contact form yet)'}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="…or asked for a whole service type"
          htmlFor="service_type"
          error={errors.service_type?.message}
          hint="Every enquiry of this type is asked it. Ignored when a service is picked above."
        >
          <Select
            id="service_type"
            hasError={!!errors.service_type}
            disabled={attachedToService}
            {...register('service_type')}
          >
            <option value="">— none —</option>
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

        {needsBounds ? (
          <>
            <FormField
              label="Smallest allowed"
              htmlFor="min_value"
              error={errors.min_value?.message}
              hint="The − button stops here. Leave blank for no bound."
            >
              <Input
                id="min_value"
                type="number"
                min="0"
                hasError={!!errors.min_value}
                {...register('min_value', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
              />
            </FormField>
            <FormField
              label="Largest allowed"
              htmlFor="max_value"
              error={errors.max_value?.message}
              hint="The + button stops here."
            >
              <Input
                id="max_value"
                type="number"
                min="0"
                hasError={!!errors.max_value}
                {...register('max_value', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
              />
            </FormField>
          </>
        ) : null}

        {isDate ? (
          <FormField
            label="Cannot be before"
            htmlFor="not_before"
            error={errors.not_before?.message}
            hint="Another question's answer key on this service, e.g. depart. A return date cannot precede its departure. Leave blank for no rule."
          >
            <Input id="not_before" dir="ltr" placeholder="depart" {...register('not_before')} />
          </FormField>
        ) : null}

        <FormField
          label="Only ask when"
          htmlFor="show_when_key"
          error={errors.show_when_key?.message}
          hint="Another question's answer key. Leave blank to always ask."
        >
          <Input id="show_when_key" dir="ltr" placeholder="trip_type" {...register('show_when_key')} />
        </FormField>
        <FormField
          label="…has this answer"
          htmlFor="show_when_value"
          error={errors.show_when_value?.message}
          hint="The English option, exactly as typed above — e.g. Round trip. One rule then covers both languages."
        >
          <Input id="show_when_value" placeholder="Round trip" {...register('show_when_value')} />
        </FormField>

        <FormField
          label="Group heading (Arabic)"
          htmlFor="group_ar"
          error={errors.group_ar?.message}
          hint="Optional. Questions in a row sharing a heading become one titled block."
        >
          <Input id="group_ar" dir="rtl" {...register('group_ar')} />
        </FormField>
        <FormField label="Group heading (English)" htmlFor="group_en" error={errors.group_en?.message}>
          <Input id="group_en" {...register('group_en')} />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('not_past')} />
        Refuse dates in the past
        <span className="text-xs text-stone-500">— dates only.</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300" {...register('is_wide')} />
        Full width
        <span className="text-xs text-stone-500">— for a long answer.</span>
      </label>

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
