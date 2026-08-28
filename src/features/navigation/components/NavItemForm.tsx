import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { navItemSchema, type NavItemFormValues } from '../schemas/navItemSchema'
import { NAV_GROUPS, type NavItem } from '../types'

interface NavItemFormProps {
  initialValues?: NavItem
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: NavItemFormValues) => void
}

export function NavItemForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: NavItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NavItemFormValues>({
    resolver: zodResolver(navItemSchema),
    defaultValues: {
      label_ar: initialValues?.label_ar ?? '',
      label_en: initialValues?.label_en ?? '',
      href: initialValues?.href ?? '/',
      group: initialValues?.group ?? 'PRIMARY',
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
        <FormField label="Label (Arabic)" htmlFor="label_ar" error={errors.label_ar?.message} required>
          <Input id="label_ar" dir="rtl" hasError={!!errors.label_ar} {...register('label_ar')} />
        </FormField>
        <FormField label="Label (English)" htmlFor="label_en" error={errors.label_en?.message} required>
          <Input id="label_en" hasError={!!errors.label_en} {...register('label_en')} />
        </FormField>

        <FormField
          label="Path"
          htmlFor="href"
          error={errors.href?.message}
          required
          hint="A path on this site, without the language prefix — /packages, not /ar/packages."
        >
          <Input id="href" dir="ltr" hasError={!!errors.href} {...register('href')} />
        </FormField>

        <FormField label="Shown in" htmlFor="group" error={errors.group?.message} required>
          <Select id="group" hasError={!!errors.group} {...register('group')}>
            {NAV_GROUPS.map((option) => (
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
          hint="Lower numbers come first, within each group."
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
        Visible on the site
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
