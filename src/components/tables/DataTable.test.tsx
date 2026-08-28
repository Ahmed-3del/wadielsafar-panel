import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTable, type DataTableColumn } from './DataTable'

interface Row {
  id: number
  name: string
}

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name },
]

describe('DataTable', () => {
  it('renders a row per item using the given columns', () => {
    const data: Row[] = [
      { id: 1, name: 'Riyadh' },
      { id: 2, name: 'Jeddah' },
    ]

    render(<DataTable columns={columns} data={data} getRowKey={(row) => row.id} />)

    expect(screen.getByText('Riyadh')).toBeInTheDocument()
    expect(screen.getByText('Jeddah')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // header + 2 data rows
  })

  it('shows the loading state instead of a table while loading', () => {
    render(<DataTable columns={columns} data={undefined} getRowKey={(row) => row.id} isLoading />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading records…')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows the empty state when there are no rows', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowKey={(row) => row.id}
        emptyTitle="No destinations yet"
      />,
    )

    expect(screen.getByText('No destinations yet')).toBeInTheDocument()
  })

  it('shows the error state with a retry action', () => {
    const onRetry = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={undefined}
        getRowKey={(row) => row.id}
        isError
        errorMessage="Network error"
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Network error')).toBeInTheDocument()
    screen.getByRole('button', { name: 'Try again' }).click()
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
