import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { socialLinkSchema, type SocialLinkFormValues } from '../schemas/socialLinkSchema'
import { SOCIAL_PLATFORMS, type SocialLink } from '../types'

interface SocialLinkFormProps {
  initialValues?: SocialLink
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: SocialLinkFormValues) => void
}

const PLATFORM_LABELS: Record<(typeof SOCIAL_PLATFORMS)[number], string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  X: 'X',
  TIKTOK: 'TikTok',
  SNAPCHAT: 'Snapchat',
  YOUTUBE: 'YouTube',
  LINKEDIN: 'LinkedIn',
  WHATSAPP: 'WhatsApp',
}

export function SocialLinkForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: SocialLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: initialValues?.platform ?? 'FACEBOOK',
      url: initialValues?.url ?? '',
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
          label="Network"
          htmlFor="platform"
          error={errors.platform?.message}
          required
          hint="Decides which icon the website draws."
        >
          <Select id="platform" hasError={!!errors.platform} {...register('platform')}>
            {SOCIAL_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {PLATFORM_LABELS[platform]}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Profile URL" htmlFor="url" error={errors.url?.message} required>
          <Input
            id="url"
            dir="ltr"
            placeholder="https://…"
            hasError={!!errors.url}
            {...register('url')}
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
