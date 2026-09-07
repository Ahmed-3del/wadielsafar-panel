import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { InquiryServiceTypeForm } from '../components/InquiryServiceTypeForm'
import { useInquiryServiceType } from '../hooks/useInquiryServiceType'
import { useSaveInquiryServiceType } from '../hooks/useSaveInquiryServiceType'
import type { InquiryServiceTypeFormValues } from '../schemas/inquiryServiceTypeSchema'
import type { InquiryServiceTypeWrite } from '../types'

export function InquiryServiceTypeFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useInquiryServiceType(recordId)
  const save = useSaveInquiryServiceType(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Service not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: InquiryServiceTypeFormValues) => {
    save.mutate(values as InquiryServiceTypeWrite, {
      onSuccess: () => {
        showToast(recordId ? 'Service updated.' : 'Service added.')
        void navigate('/contact-services')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit service' : 'New service'}
      </h1>
      <Card>
        <InquiryServiceTypeForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Add service'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
