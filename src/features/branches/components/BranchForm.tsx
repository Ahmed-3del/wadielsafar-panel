import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
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
