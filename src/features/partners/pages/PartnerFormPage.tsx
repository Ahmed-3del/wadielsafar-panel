import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableString } from '@/utils/formValues'
import { PartnerForm } from '../components/PartnerForm'
import { usePartner } from '../hooks/usePartner'
import { useSavePartner } from '../hooks/useSavePartner'
import type { PartnerFormValues } from '../schemas/partnerSchema'

export function PartnerFormPage() {
  const { id } = useParams<{ id: string }>()
  const partnerId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: partner, isLoading, isError, error, refetch } = usePartner(partnerId)
  const savePartner = useSavePartner(partnerId)

  if (partnerId && isLoading) return <Spinner label="Loading partner…" />
  if (partnerId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Partner not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: PartnerFormValues) => {
    savePartner.mutate(
      { ...values, logo: toNullableString(values.logo) },
      {
        onSuccess: () => {
          showToast(partnerId ? 'Partner updated.' : 'Partner created.')
          void navigate('/partners')
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
        {partnerId ? 'Edit Partner' : 'New Partner'}
      </h1>
      <Card>
        <PartnerForm
          initialValues={partner}
          isSubmitting={savePartner.isPending}
          submitLabel={partnerId ? 'Save changes' : 'Create partner'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
