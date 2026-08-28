import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { BranchForm } from '../components/BranchForm'
import { useBranch } from '../hooks/useBranch'
import { useSaveBranch } from '../hooks/useSaveBranch'
import type { BranchFormValues } from '../schemas/branchSchema'

export function BranchFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useBranch(recordId)
  const save = useSaveBranch(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Branch not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: BranchFormValues) => {
    save.mutate(values, {
      onSuccess: () => {
        showToast(recordId ? 'Branch updated.' : 'Branch created.')
        void navigate('/branches')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit branch' : 'New branch'}
      </h1>
      <Card>
        <BranchForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create branch'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
