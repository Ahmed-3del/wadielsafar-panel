import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { PageHeroForm } from '../components/PageHeroForm'
import { usePageHero } from '../hooks/usePageHero'
import { useSavePageHero } from '../hooks/useSavePageHero'
import type { PageHeroFormValues } from '../schemas/pageHeroSchema'

export function PageHeroFormPage() {
  const { pageKey } = useParams<{ pageKey: string }>()
  const navigate = useNavigate()
  const { data: hero, isLoading, isError, error, refetch } = usePageHero(pageKey)
  const saveHero = useSavePageHero(pageKey)

  if (pageKey && isLoading) return <Spinner label="Loading hero…" />
  if (pageKey && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Hero not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: PageHeroFormValues) => {
    saveHero.mutate(values, {
      onSuccess: () => {
        showToast(pageKey ? 'Hero updated.' : 'Hero created.')
        void navigate('/pages')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {pageKey ? `Edit ${pageKey} hero` : 'New page hero'}
      </h1>
      <Card>
        <PageHeroForm
          initialValues={hero}
          isSubmitting={saveHero.isPending}
          submitLabel={pageKey ? 'Save changes' : 'Create hero'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
