import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { CruisePortForm } from '../components/CruisePortForm'
import { useCruisePort } from '../hooks/useCruisePort'
import { useSaveCruisePort } from '../hooks/useSaveCruisePort'
import type { CruisePortFormValues } from '../schemas/cruisePortSchema'

export function CruisePortFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useCruisePort(recordId)
  const save = useSaveCruisePort(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Port not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: CruisePortFormValues) => {
    save.mutate(
      { ...values, country_code: values.country_code.toUpperCase() },
      {
        onSuccess: () => {
          showToast(recordId ? 'Port updated.' : 'Port created.')
          void navigate('/cruise-ports')
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
        {recordId ? 'Edit cruise port' : 'New cruise port'}
      </h1>
      <Card>
        <CruisePortForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create port'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
