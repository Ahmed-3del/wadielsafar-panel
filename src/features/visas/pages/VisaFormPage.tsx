import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { VisaForm } from '../components/VisaForm'
import { useVisa } from '../hooks/useVisa'
import { useSaveVisa } from '../hooks/useSaveVisa'
import type { VisaFormValues } from '../schemas/visaSchema'

export function VisaFormPage() {
  const { id } = useParams<{ id: string }>()
  const visaId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: visa, isLoading, isError, error, refetch } = useVisa(visaId)
  const saveVisa = useSaveVisa(visaId)

  if (visaId && isLoading) return <Spinner label="Loading visa type…" />
  if (visaId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Visa type not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: VisaFormValues) => {
    saveVisa.mutate(
      {
        ...values,
        country_id: Number(values.country_id),
        validity_days: values.validity_days ? Number(values.validity_days) : null,
      },
      {
        onSuccess: () => {
          showToast(visaId ? 'Visa type updated.' : 'Visa type created.')
          void navigate('/visas')
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
        {visaId ? 'Edit Visa Type' : 'New Visa Type'}
      </h1>
      <Card>
        <VisaForm
          initialValues={visa}
          isSubmitting={saveVisa.isPending}
          submitLabel={visaId ? 'Save changes' : 'Create visa type'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
