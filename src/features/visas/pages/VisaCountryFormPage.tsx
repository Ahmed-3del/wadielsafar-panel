import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { VisaCountryForm } from '../components/VisaCountryForm'
import { useVisaCountry } from '../hooks/useVisaCountry'
import { useSaveVisaCountry } from '../hooks/useSaveVisaCountry'
import type { VisaCountryFormValues } from '../schemas/visaCountrySchema'

export function VisaCountryFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useVisaCountry(recordId)
  const save = useSaveVisaCountry(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Country not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: VisaCountryFormValues) => {
    // Blank image fields are "none", which the API stores as null.
    const payload = {
      ...values,
      flag_image: values.flag_image.trim() || null,
      cover_image: values.cover_image.trim() || null,
    }

    save.mutate(payload, {
      onSuccess: () => {
        showToast(recordId ? 'Country updated.' : 'Country created.')
        void navigate('/visa-countries')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit country' : 'New country'}
      </h1>
      <Card>
        <VisaCountryForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create country'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
