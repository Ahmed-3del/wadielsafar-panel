import { Button, Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useHomeSections } from '../hooks/useHomeSections'
import { useReorderHomeSections } from '../hooks/useReorderHomeSections'
import { useToggleHomeSection } from '../hooks/useToggleHomeSection'
import type { HomeSection } from '../types'

/*
 * The homepage's running order.
 *
 * Up and down rather than an order number in a text box: the question an
 * editor is answering is "what comes first", and a column of numbers makes
 * them do arithmetic to answer it. Each move sends the whole list, so two
 * sections can never end up claiming the same position.
 *
 * The checkbox is the only indicator of whether a section is shown — a
 * status badge beside it said the same thing twice. A hidden row is dimmed
 * instead, which is readable at a glance without adding a second control.
 *
 * The controls are not disabled while a move is in flight. The cache is
 * updated optimistically, so a second click is computed against the list as
 * already shown and queues behind the first with the right order in it.
 */
export function HomeSectionsPage() {
  const { data, isLoading, isError, error, refetch } = useHomeSections()
  const reorder = useReorderHomeSections()
  const toggle = useToggleHomeSection()

  if (isLoading) return <Spinner label="Loading sections…" />
  if (isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Could not load the homepage sections.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const sections = [...(data?.results ?? [])].sort((a, b) => a.order - b.order)

  const move = (index: number, direction: -1 | 1) => {
    const next = [...sections]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]

    reorder.mutate(
      next.map((section) => section.key),
      {
        onSuccess: () => { showToast('Order updated.') },
        onError: (err: unknown) => { showToast(extractErrorMessage(err), 'error') },
      },
    )
  }

  const setActive = (section: HomeSection, is_active: boolean) => {
    toggle.mutate(
      { id: section.id, is_active },
      {
        onSuccess: () => {
          showToast(`${section.label} ${is_active ? 'shown' : 'hidden'}.`)
        },
        onError: (err: unknown) => { showToast(extractErrorMessage(err), 'error') },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Homepage sections</h1>
        <p className="mt-1 text-sm text-stone-500">
          What the homepage shows below the search box, and in what order. The hero and its
          search are always first and cannot be hidden.
        </p>
      </div>

      <Card>
        <ol className="flex flex-col">
          {sections.map((section, index) => (
            <li
              key={section.id}
              className={`flex items-center gap-4 border-b border-stone-100 py-3 last:border-b-0 ${
                section.is_active ? '' : 'opacity-45'
              }`}
            >
              <span className="w-6 shrink-0 text-sm font-semibold text-stone-400">
                {index + 1}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-navy-900">{section.label}</span>
                <span className="block font-mono text-xs text-stone-400">{section.key}</span>
              </span>

              <label className="flex shrink-0 items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300"
                  checked={section.is_active}
                  onChange={(event) => { setActive(section, event.target.checked) }}
                />
                Show
              </label>

              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  aria-label={`Move ${section.label} up`}
                  disabled={index === 0}
                  onClick={() => { move(index, -1) }}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Move ${section.label} down`}
                  disabled={index === sections.length - 1}
                  onClick={() => { move(index, 1) }}
                >
                  ↓
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <p className="text-xs text-stone-500">
        A hidden section keeps its place in this list, so switching it back on puts it where it
        was. Sections cannot be added or deleted here — each one is a block the website ships.
      </p>
    </div>
  )
}
