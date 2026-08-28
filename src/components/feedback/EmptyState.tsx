import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-stone-300 px-4 py-12 text-center">
      <p className="text-sm font-medium text-stone-700">{title}</p>
      {description && <p className="text-sm text-stone-500">{description}</p>}
      {action}
    </div>
  )
}
