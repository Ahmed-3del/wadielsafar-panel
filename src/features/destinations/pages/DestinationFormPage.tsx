import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { DestinationForm } from '../components/DestinationForm'
import { useDestination } from '../hooks/useDestination'
import { useSaveDestination } from '../hooks/useSaveDestination'
import type { DestinationFormValues } from '../schemas/destinationSchema'

export function DestinationFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: destination, isLoading, isError, error, refetch } = useDestination(slug)
  const saveDestination = useSaveDestination(slug)

  if (slug && isLoading) return <Spinner label="Loading destination…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Destination not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: DestinationFormValues) => {
    saveDestination.mutate(
      { ...values, cover_image: values.cover_image || null },
      {
        onSuccess: () => {
          showToast(slug ? 'Destination updated.' : 'Destination created.')
          void navigate('/destinations')
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
        {slug ? 'Edit Destination' : 'New Destination'}
      </h1>
      <Card>
        <DestinationForm
          initialValues={destination}
          isSubmitting={saveDestination.isPending}
          submitLabel={slug ? 'Save changes' : 'Create destination'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
