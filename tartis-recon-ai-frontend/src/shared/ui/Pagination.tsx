import { Button, Select } from './'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (params: { page: number; pageSize: number }) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

function formatRange(page: number, pageSize: number, total: number): string {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const numberFormatter = new Intl.NumberFormat('es-ES')
  return `${numberFormatter.format(start)} - ${numberFormatter.format(end)} de ${numberFormatter.format(total)} registros`
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  const handlePrevious = () => {
    if (isFirstPage) return
    onChange({ page: page - 1, pageSize })
  }

  const handleNext = () => {
    if (isLastPage) return
    onChange({ page: page + 1, pageSize })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    onChange({ page: 1, pageSize: newPageSize })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-border-subtle bg-surface-card text-sm text-gray-400">
      <span>{formatRange(page, pageSize, total)}</span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span>Mostrar</span>
          <Select
            aria-label="Registros por página"
            value={String(pageSize)}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="w-20"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={String(size)}>
                {size}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevious}
            disabled={isFirstPage}
          >
            Anterior
          </Button>
          <span className="px-2 text-gray-300">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            disabled={isLastPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
