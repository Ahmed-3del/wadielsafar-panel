import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { CruiseForm } from '../components/CruiseForm'
import { useCruise } from '../hooks/useCruise'
import { useSaveCruise } from '../hooks/useSaveCruise'
import type { CruiseFormValues } from '../schemas/cruiseSchema'

export function CruiseFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: cruise, isLoading, isError, error, refetch } = useCruise(slug)
  const saveCruise = useSaveCruise(slug)

  if (slug && isLoading) return <Spinner label="Loading cruise…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Cruise not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: CruiseFormValues) => {
    saveCruise.mutate(
      {
        ...values,
        destination_id: values.destination_id ? Number(values.destination_id) : null,
        cover_image: values.cover_image || null,
        // An empty date input is "not scheduled yet", not an empty string.
        departure_date: values.departure_date || null,
      },
      {
        onSuccess: () => {
          showToast(slug ? 'Cruise updated.' : 'Cruise created.')
          void navigate('/cruises')
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
        {slug ? 'Edit Cruise' : 'New Cruise'}
      </h1>
      <Card>
        <CruiseForm
          initialValues={cruise}
          isSubmitting={saveCruise.isPending}
          submitLabel={slug ? 'Save changes' : 'Create cruise'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
