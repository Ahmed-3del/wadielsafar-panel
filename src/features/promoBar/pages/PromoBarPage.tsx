import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { PromoBarForm } from '../components/PromoBarForm'
import { usePromoBar } from '../hooks/usePromoBar'
import { useSavePromoBar } from '../hooks/useSavePromoBar'
import type { PromoBarFormValues } from '../schemas/promoBarSchema'

export function PromoBarPage() {
  const { data: record, isLoading, isError, error, refetch } = usePromoBar()
  const save = useSavePromoBar()

  if (isLoading) return <Spinner label="Loading…" />
  if (isError || !record) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Could not load the promo bar.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: PromoBarFormValues) => {
    const payload = { ...values, link: values.link.trim() }

    save.mutate(payload, {
      onSuccess: () => {
        showToast('Promo bar updated.')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Promo bar</h1>
        <p className="mt-1 text-sm text-stone-500">
          The strip pinned across the top of every page on the site.
        </p>
      </div>
      <Card>
        <PromoBarForm initialValues={record} isSubmitting={save.isPending} onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}
