import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableString } from '@/utils/formValues'
import { TestimonialForm } from '../components/TestimonialForm'
import { useTestimonial } from '../hooks/useTestimonial'
import { useSaveTestimonial } from '../hooks/useSaveTestimonial'
import type { TestimonialFormValues } from '../schemas/testimonialSchema'

export function TestimonialFormPage() {
  const { id } = useParams<{ id: string }>()
  const testimonialId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: testimonial, isLoading, isError, error, refetch } = useTestimonial(testimonialId)
  const saveTestimonial = useSaveTestimonial(testimonialId)

  if (testimonialId && isLoading) return <Spinner label="Loading testimonial…" />
  if (testimonialId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Testimonial not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: TestimonialFormValues) => {
    saveTestimonial.mutate(
      {
        customer_name: values.customer_name,
        customer_title_ar: values.customer_title_ar,
        customer_title_en: values.customer_title_en,
        content_ar: values.content_ar,
        content_en: values.content_en,
        rating: Number(values.rating),
        avatar_image: toNullableString(values.avatar_image),
        service_type: values.service_type === '' ? null : values.service_type,
        is_visible: values.is_visible,
        order: values.order,
      },
      {
        onSuccess: () => {
          showToast(testimonialId ? 'Testimonial updated.' : 'Testimonial created.')
          void navigate('/testimonials')
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {testimonialId ? 'Edit Testimonial' : 'New Testimonial'}
      </h1>
      <Card>
        <TestimonialForm
          initialValues={testimonial}
          isSubmitting={saveTestimonial.isPending}
          submitLabel={testimonialId ? 'Save changes' : 'Create testimonial'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
