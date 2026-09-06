import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { promotionSchema, type PromotionFormValues } from '../schemas/promotionSchema'
import { toLocalInputValue } from '@/utils/formatDate'
import { PROMOTION_ICONS, type Promotion, type PromotionIcon } from '../types'

interface PromotionFormProps {
  initialValues?: Promotion
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: PromotionFormValues) => void
}

const ICON_LABELS: Record<PromotionIcon, string> = {
  TAG: 'Discount tag',
  CLOCK: 'Countdown',
  GIFT: 'Referral gift',
}

export function PromotionForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      description_ar: initialValues?.description_ar ?? '',
      description_en: initialValues?.description_en ?? '',
      badge_ar: initialValues?.badge_ar ?? '',
      badge_en: initialValues?.badge_en ?? '',
      code: initialValues?.code ?? '',
      ends_at: toLocalInputValue(initialValues?.ends_at ?? null),
      icon: initialValues?.icon ?? 'TAG',
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
          label="Title (Arabic)"
          htmlFor="title_ar"
          error={errors.title_ar?.message}
          required
        >
          <Input id="title_ar" dir="rtl" hasError={!!errors.title_ar} {...register('title_ar')} />
        </FormField>
        <FormField
          label="Title (English)"
          htmlFor="title_en"
          error={errors.title_en?.message}
          required
        >
          <Input id="title_en" hasError={!!errors.title_en} {...register('title_en')} />
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
          label="Headline figure (Arabic)"
          htmlFor="badge_ar"
          error={errors.badge_ar?.message}
          hint="The big number on the card: 15%, 200 ر.س. Leave blank on a card that leads with a countdown."
        >
          <Input id="badge_ar" dir="rtl" {...register('badge_ar')} />
        </FormField>
        <FormField
          label="Headline figure (English)"
          htmlFor="badge_en"
          error={errors.badge_en?.message}
        >
          <Input id="badge_en" dir="ltr" {...register('badge_en')} />
        </FormField>

        <FormField
          label="Code"
          htmlFor="code"
          error={errors.code?.message}
          hint="Shown as something to quote, e.g. WELCOME15. Blank if the offer needs no code."
        >
          <Input id="code" dir="ltr" {...register('code')} />
        </FormField>

        <FormField
          label="Icon"
          htmlFor="icon"
          error={errors.icon?.message}
          hint="Which mark the website draws on the card."
        >
          <Select id="icon" hasError={!!errors.icon} {...register('icon')}>
            {PROMOTION_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {ICON_LABELS[icon]}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Ends at"
          htmlFor="ends_at"
          error={errors.ends_at?.message}
          hint="The website counts down to this in public, in days, hours and minutes, and hides the card once it passes. Leave blank for a standing offer with no deadline. Uses this computer's clock and time zone."
        >
          <Input
            id="ends_at"
            type="datetime-local"
            dir="ltr"
            hasError={!!errors.ends_at}
            {...register('ends_at')}
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
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-stone-300"
          {...register('is_active')}
        />
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
