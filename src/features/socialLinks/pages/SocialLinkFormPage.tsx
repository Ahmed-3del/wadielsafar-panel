import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { SocialLinkForm } from '../components/SocialLinkForm'
import { useSocialLink } from '../hooks/useSocialLink'
import { useSaveSocialLink } from '../hooks/useSaveSocialLink'
import type { SocialLinkFormValues } from '../schemas/socialLinkSchema'

export function SocialLinkFormPage() {
  const { id } = useParams<{ id: string }>()
  const recordId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: record, isLoading, isError, error, refetch } = useSocialLink(recordId)
  const save = useSaveSocialLink(recordId)

  if (recordId && isLoading) return <Spinner label="Loading…" />
  if (recordId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Link not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: SocialLinkFormValues) => {
    save.mutate(values, {
      onSuccess: () => {
        showToast(recordId ? 'Link updated.' : 'Link created.')
        void navigate('/social-links')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {recordId ? 'Edit link' : 'New link'}
      </h1>
      <Card>
        <SocialLinkForm
          initialValues={record}
          isSubmitting={save.isPending}
          submitLabel={recordId ? 'Save changes' : 'Create link'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
