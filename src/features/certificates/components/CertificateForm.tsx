import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { certificateSchema, type CertificateFormValues } from '../schemas/certificateSchema'
import type { Certificate } from '../types'

interface CertificateFormProps {
  initialValues?: Certificate
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: CertificateFormValues) => void
}

export function CertificateForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: CertificateFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name_ar: initialValues?.name_ar ?? '',
      name_en: initialValues?.name_en ?? '',
      issuer_ar: initialValues?.issuer_ar ?? '',
      issuer_en: initialValues?.issuer_en ?? '',
      reference_number: initialValues?.reference_number ?? '',
      image: initialValues?.image ?? '',
      document: initialValues?.document ?? '',
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
          label="Issued by (Arabic)"
          htmlFor="issuer_ar"
          error={errors.issuer_ar?.message}
          hint="e.g. وزارة التجارة"
        >
          <Input id="issuer_ar" dir="rtl" {...register('issuer_ar')} />
        </FormField>
        <FormField
          label="Issued by (English)"
          htmlFor="issuer_en"
          error={errors.issuer_en?.message}
          hint="e.g. Ministry of Commerce"
        >
          <Input id="issuer_en" {...register('issuer_en')} />
        </FormField>

        <FormField
          label="Badge image"
          htmlFor="image"
          error={errors.image?.message}
          hint="The logo shown in the footer. Left blank, the footer shows the certificate's name instead of a badge."
        >
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="image"
                accept="image"
                shape="logo"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormField>

        <FormField
          label="Document"
          htmlFor="document"
          error={errors.document?.message}
          hint="The PDF visitors open when they tap the badge. A link to the authority's verification page works too — that one opens in a new tab."
        >
          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <MediaUploadField
                id="document"
                accept="document"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!errors.document}
              />
            )}
          />
        </FormField>

        <FormField
          label="Reference number"
          htmlFor="reference_number"
          error={errors.reference_number?.message}
          hint="Optional. Shown under the name when there is no badge image."
        >
          <Input id="reference_number" dir="ltr" {...register('reference_number')} />
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
