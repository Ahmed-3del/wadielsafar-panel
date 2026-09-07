import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { PromotionForm } from '../components/PromotionForm'
import { usePromotion } from '../hooks/usePromotion'
import { useSavePromotion } from '../hooks/useSavePromotion'
import type { PromotionFormValues } from '../schemas/promotionSchema'

export function PromotionFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = usePromotion(recordId)
  const save = useSavePromotion(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Promotion not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: PromotionFormValues) => {
    // The picker hands back local wall-clock time; the API stores instants.
    // Blank stays blank — that is "no announced end", not midnight.
    const payload = {
      ...values,
      ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
      // Trimmed, so a stray space cannot make "/packages " a path that routes
      // nowhere.
      link: values.link.trim(),
    }

    save.mutate(payload, {
      onSuccess: () => {
        showToast(recordId ? 'Promotion updated.' : 'Promotion created.')
        void navigate('/promotions')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit promotion' : 'New promotion'}
      </h1>
      <Card>
        <PromotionForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create promotion'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
