import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableNumber, toNullableString } from '@/utils/formValues'
import { OfferForm } from '../components/OfferForm'
import { useOffer } from '../hooks/useOffer'
import { useSaveOffer } from '../hooks/useSaveOffer'
import type { OfferFormValues } from '../schemas/offerSchema'

export function OfferFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: offer, isLoading, isError, error, refetch } = useOffer(slug)
  const saveOffer = useSaveOffer(slug)

  if (slug && isLoading) return <Spinner label="Loading offer…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Offer not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: OfferFormValues) => {
    saveOffer.mutate(
      {
        title_ar: values.title_ar,
        title_en: values.title_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        service_type: values.service_type,
        price_before: toNullableNumber(values.price_before),
        price_after: toNullableNumber(values.price_after),
        image: toNullableString(values.image),
        starts_at: values.starts_at,
        ends_at: values.ends_at,
        is_featured: values.is_featured,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          showToast(slug ? 'Offer updated.' : 'Offer created.')
          void navigate('/offers')
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">{slug ? 'Edit Offer' : 'New Offer'}</h1>
      <Card>
        <OfferForm
          initialValues={offer}
          isSubmitting={saveOffer.isPending}
          submitLabel={slug ? 'Save changes' : 'Create offer'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
