import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { MediaUploadField } from '@/components/forms/MediaUploadField'
import { pageHeroSchema, type PageHeroFormValues } from '../schemas/pageHeroSchema'
import { HERO_MEDIA_TYPES, PAGE_KEYS, type PageHero } from '../types'

interface PageHeroFormProps {
  initialValues?: PageHero
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: PageHeroFormValues) => void
}

export function PageHeroForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: PageHeroFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PageHeroFormValues>({
    resolver: zodResolver(pageHeroSchema),
    defaultValues: {
      // The first entry rather than a name typed out here, so removing a key
      // from the list (as "home" just was) can never leave this defaulting to
      // a choice that no longer exists.
      page_key: initialValues?.page_key ?? PAGE_KEYS[0],
      media_type: initialValues?.media_type ?? 'NONE',
      image_url: initialValues?.image_url ?? '',
      video_url: initialValues?.video_url ?? '',
      poster_url: initialValues?.poster_url ?? '',
      overlay_opacity: initialValues?.overlay_opacity ?? 55,
      eyebrow_ar: initialValues?.eyebrow_ar ?? '',
      eyebrow_en: initialValues?.eyebrow_en ?? '',
      title_ar: initialValues?.title_ar ?? '',
      title_en: initialValues?.title_en ?? '',
      subtitle_ar: initialValues?.subtitle_ar ?? '',
      subtitle_en: initialValues?.subtitle_en ?? '',
      is_active: initialValues?.is_active ?? true,
    },
  })

  // Only the fields relevant to the chosen media type are shown; a form that
  // asks for a video URL on a gradient hero invites confusing half-filled rows.
  // useWatch rather than watch(): reading `watch` during render trips the
  // React Compiler lint rule.
  const mediaType = useWatch({ control, name: 'media_type' })

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Page" htmlFor="page_key" error={errors.page_key?.message} required>
          <Select id="page_key" disabled={!!initialValues} {...register('page_key')}>
            {PAGE_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Background"
          htmlFor="media_type"
          error={errors.media_type?.message}
          required
        >
          <Select id="media_type" {...register('media_type')}>
            {HERO_MEDIA_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        {mediaType === 'IMAGE' && (
          <FormField
            label="Image"
            htmlFor="image_url"
            error={errors.image_url?.message}
            required
            className="sm:col-span-2"
          >
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <MediaUploadField
                  id="image_url"
                  accept="image"
                  placeholder="https://…"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormField>
        )}

        {mediaType === 'VIDEO' && (
          <>
            <FormField
              label="Video"
              htmlFor="video_url"
              error={errors.video_url?.message}
              required
            >
              <Controller
                name="video_url"
                control={control}
                render={({ field }) => (
                  <MediaUploadField
                    id="video_url"
                    accept="video"
                    placeholder="https://… or upload MP4 / WebM"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>
            <FormField
              label="Poster image"
              htmlFor="poster_url"
              error={errors.poster_url?.message}
              hint="Shown on mobile, on slow connections, and to visitors who prefer reduced motion."
            >
              <Controller
                name="poster_url"
                control={control}
                render={({ field }) => (
                  <MediaUploadField
                    id="poster_url"
                    accept="image"
                    placeholder="https://…"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>
          </>
        )}

        {mediaType !== 'NONE' && (
          <FormField
            label="Overlay strength (%)"
            htmlFor="overlay_opacity"
            error={errors.overlay_opacity?.message}
            hint="Darkens the media so the headline stays readable. 55 suits most photos."
          >
            <Input
              id="overlay_opacity"
              type="number"
              min="0"
              max="100"
              {...register('overlay_opacity', { valueAsNumber: true })}
            />
          </FormField>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-navy-900">Copy overrides</p>
        <p className="mt-1 text-xs text-stone-500">
          Leave blank to keep the site&apos;s own translated text for this page.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Eyebrow (Arabic)" htmlFor="eyebrow_ar">
            <Input id="eyebrow_ar" dir="rtl" {...register('eyebrow_ar')} />
          </FormField>
          <FormField label="Eyebrow (English)" htmlFor="eyebrow_en">
            <Input id="eyebrow_en" {...register('eyebrow_en')} />
          </FormField>
          <FormField label="Title (Arabic)" htmlFor="title_ar">
            <Input id="title_ar" dir="rtl" {...register('title_ar')} />
          </FormField>
          <FormField label="Title (English)" htmlFor="title_en">
            <Input id="title_en" {...register('title_en')} />
          </FormField>
          <FormField label="Subtitle (Arabic)" htmlFor="subtitle_ar">
            <Input id="subtitle_ar" dir="rtl" {...register('subtitle_ar')} />
          </FormField>
          <FormField label="Subtitle (English)" htmlFor="subtitle_en">
            <Input id="subtitle_en" {...register('subtitle_en')} />
          </FormField>
        </div>
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
