import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableNumber, toNullableString } from '@/utils/formValues'
import { FlightForm } from '../components/FlightForm'
import { useFlight } from '../hooks/useFlight'
import { useSaveFlight } from '../hooks/useSaveFlight'
import type { FlightFormValues } from '../schemas/flightSchema'

export function FlightFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: flight, isLoading, isError, error, refetch } = useFlight(slug)
  const saveFlight = useSaveFlight(slug)

  if (slug && isLoading) return <Spinner label="Loading flight deal…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Flight deal not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: FlightFormValues) => {
    saveFlight.mutate(
      {
        title_ar: values.title_ar,
        title_en: values.title_en,
        origin_city_ar: values.origin_city_ar,
        origin_city_en: values.origin_city_en,
        origin_airport_code: values.origin_airport_code.toUpperCase(),
        destination_city_ar: values.destination_city_ar,
        destination_city_en: values.destination_city_en,
        destination_airport_code: values.destination_airport_code.toUpperCase(),
        airline_name_ar: values.airline_name_ar,
        airline_name_en: values.airline_name_en,
        airline_logo: toNullableString(values.airline_logo),
        cover_image: toNullableString(values.cover_image),
        trip_type: values.trip_type,
        cabin_class: values.cabin_class,
        price_from: values.price_from,
        departure_date: toNullableString(values.departure_date),
        return_date: toNullableString(values.return_date),
        baggage_allowance_kg: toNullableNumber(values.baggage_allowance_kg),
        is_featured: values.is_featured,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          showToast(slug ? 'Flight deal updated.' : 'Flight deal created.')
          void navigate('/flights')
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
        {slug ? 'Edit Flight Deal' : 'New Flight Deal'}
      </h1>
      <Card>
        <FlightForm
          initialValues={flight}
          isSubmitting={saveFlight.isPending}
          submitLabel={slug ? 'Save changes' : 'Create flight deal'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
