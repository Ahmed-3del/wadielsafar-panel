import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { Spinner } from './Spinner'
import { ErrorState } from './ErrorState'

interface ComingSoonPageProps {
  title: string
  description?: string
  isLoading: boolean
  isError: boolean
  count?: number
  onRetry?: () => void
  children?: ReactNode
}

/**
 * Shared shell for scaffolded modules: proves the stub API call reaches the real (minimal)
 * backend endpoint while making clear that full CRUD UI is a later-phase addition.
 */
export function ComingSoonPage({
  title,
  description,
  isLoading,
  isError,
  count,
  onRetry,
  children,
}: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">{title}</h1>
        {description && <p className="text-sm text-stone-500">{description}</p>}
      </div>
      <Card>
        {isLoading && <Spinner label={`Checking ${title.toLowerCase()} data…`} />}
        {isError && (
          <ErrorState
            message={`Could not reach the ${title.toLowerCase()} endpoint.`}
            onRetry={onRetry}
          />
        )}
        {!isLoading && !isError && (
          <p className="text-sm text-stone-600">
            {count ?? 0} record(s) currently in the backend. This module is scaffolded in phase 1
            — full management UI ships in a later phase without restructuring.
          </p>
        )}
      </Card>
      {children}
    </div>
  )
}
