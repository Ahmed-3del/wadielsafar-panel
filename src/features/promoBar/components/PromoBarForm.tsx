import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { promoBarSchema, type PromoBarFormValues } from '../schemas/promoBarSchema'
import type { PromoBar } from '../types'

interface PromoBarFormProps {
  initialValues: PromoBar
  isSubmitting: boolean
  onSubmit: (values: PromoBarFormValues) => void
}

export function PromoBarForm({ initialValues, isSubmitting, onSubmit }: PromoBarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromoBarFormValues>({
    resolver: zodResolver(promoBarSchema),
    defaultValues: {
      headline_ar: initialValues.headline_ar,
      headline_en: initialValues.headline_en,
      code: initialValues.code,
      cta_label_ar: initialValues.cta_label_ar,
      cta_label_en: initialValues.cta_label_en,
      link: initialValues.link,
      is_active: initialValues.is_active,
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
          label="Headline (Arabic)"
          htmlFor="headline_ar"
          error={errors.headline_ar?.message}
          required
        >
          <Input id="headline_ar" dir="rtl" hasError={!!errors.headline_ar} {...register('headline_ar')} />
        </FormField>
        <FormField
          label="Headline (English)"
          htmlFor="headline_en"
          error={errors.headline_en?.message}
          required
        >
          <Input id="headline_en" hasError={!!errors.headline_en} {...register('headline_en')} />
        </FormField>

        <FormField
          label="Code"
          htmlFor="code"
          error={errors.code?.message}
          hint="Shown in its own chip, e.g. WELCOME15. Blank hides the chip — not every offer needs one to quote."
        >
          <Input id="code" dir="ltr" {...register('code')} />
        </FormField>

        <FormField
          label="Button leads to"
          htmlFor="link"
          error={errors.link?.message}
          hint="A path on this site, e.g. /packages. Blank opens the contact form carrying this code, so the agent sees what was promised."
        >
          <Input id="link" dir="ltr" placeholder="/contact" hasError={!!errors.link} {...register('link')} />
        </FormField>

        <FormField
          label="Button text (Arabic)"
          htmlFor="cta_label_ar"
          error={errors.cta_label_ar?.message}
          required
        >
          <Input id="cta_label_ar" dir="rtl" {...register('cta_label_ar')} />
        </FormField>
        <FormField
          label="Button text (English)"
          htmlFor="cta_label_en"
          error={errors.cta_label_en?.message}
          required
        >
          <Input id="cta_label_en" {...register('cta_label_en')} />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-stone-300"
          {...register('is_active')}
        />
        Active — shown across the top of every page
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
