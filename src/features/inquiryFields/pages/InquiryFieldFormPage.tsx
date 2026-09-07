import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { InquiryFieldForm } from '../components/InquiryFieldForm'
import { useInquiryField } from '../hooks/useInquiryField'
import { useSaveInquiryField } from '../hooks/useSaveInquiryField'
import type { InquiryFieldFormValues } from '../schemas/inquiryFieldSchema'

export function InquiryFieldFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useInquiryField(recordId)
  const save = useSaveInquiryField(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Question not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: InquiryFieldFormValues) => {
    // A question belongs to one or the other. The type picker is disabled once
    // a service is chosen, but a disabled control still carries its last value
    // — and sending both would file the question under a type it is not asked
    // for.
    const payload = values.service ? { ...values, service_type: '' } : { ...values, service: null }
    save.mutate(payload, {
      onSuccess: () => {
        showToast(recordId ? 'Question updated.' : 'Question added.')
        void navigate('/contact-fields')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit question' : 'New question'}
      </h1>
      <Card>
        <InquiryFieldForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Add question'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
