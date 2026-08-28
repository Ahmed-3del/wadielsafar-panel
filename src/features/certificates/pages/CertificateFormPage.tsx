import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { CertificateForm } from '../components/CertificateForm'
import { useCertificate } from '../hooks/useCertificate'
import { useSaveCertificate } from '../hooks/useSaveCertificate'
import type { CertificateFormValues } from '../schemas/certificateSchema'

export function CertificateFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useCertificate(recordId)
  const save = useSaveCertificate(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Certificate not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: CertificateFormValues) => {
    save.mutate(values, {
      onSuccess: () => {
        showToast(recordId ? 'Certificate updated.' : 'Certificate created.')
        void navigate('/certificates')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit certificate' : 'New certificate'}
      </h1>
      <Card>
        <CertificateForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create certificate'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
