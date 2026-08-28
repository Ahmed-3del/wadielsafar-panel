import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { AirportForm } from '../components/AirportForm'
import { useAirport } from '../hooks/useAirport'
import { useSaveAirport } from '../hooks/useSaveAirport'
import type { AirportFormValues } from '../schemas/airportSchema'

export function AirportFormPage() {
  const { id } = useParams<{ id: string }>()
  const airportId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: airport, isLoading, isError, error, refetch } = useAirport(airportId)
  const saveAirport = useSaveAirport(airportId)

  if (airportId && isLoading) return <Spinner label="Loading airport…" />
  if (airportId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Airport not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: AirportFormValues) => {
    saveAirport.mutate(values, {
      onSuccess: () => {
        showToast(airportId ? 'Airport updated.' : 'Airport created.')
        void navigate('/airports')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {airportId ? 'Edit Airport' : 'New Airport'}
      </h1>
      <Card>
        <AirportForm
          initialValues={airport}
          isSubmitting={saveAirport.isPending}
          submitLabel={airportId ? 'Save changes' : 'Create airport'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
