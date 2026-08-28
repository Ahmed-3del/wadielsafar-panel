import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableString } from '@/utils/formValues'
import { HotelForm } from '../components/HotelForm'
import { useHotel } from '../hooks/useHotel'
import { useSaveHotel } from '../hooks/useSaveHotel'
import type { HotelFormValues } from '../schemas/hotelSchema'

export function HotelFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: hotel, isLoading, isError, error, refetch } = useHotel(slug)
  const saveHotel = useSaveHotel(slug)

  if (slug && isLoading) return <Spinner label="Loading hotel…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Hotel not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: HotelFormValues) => {
    saveHotel.mutate(
      {
        name_ar: values.name_ar,
        name_en: values.name_en,
        destination_id: Number(values.destination_id),
        star_rating: Number(values.star_rating),
        address_ar: values.address_ar,
        address_en: values.address_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        amenity_ids: values.amenity_ids.map(Number),
        price_per_night_from: values.price_per_night_from,
        cover_image: toNullableString(values.cover_image),
        check_in_time: toNullableString(values.check_in_time),
        check_out_time: toNullableString(values.check_out_time),
        is_featured: values.is_featured,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          showToast(slug ? 'Hotel updated.' : 'Hotel created.')
          void navigate('/hotels')
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">{slug ? 'Edit Hotel' : 'New Hotel'}</h1>
      <Card>
        <HotelForm
          initialValues={hotel}
          isSubmitting={saveHotel.isPending}
          submitLabel={slug ? 'Save changes' : 'Create hotel'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
