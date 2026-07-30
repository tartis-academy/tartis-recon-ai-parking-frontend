import { TextInput, Button, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface TicketTableToolbarProps {
  total: number
  search: string
  dateFrom: string
  dateTo: string
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onClearFilters: () => void
}

export function TicketTableToolbar({
  total,
  search,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: TicketTableToolbarProps) {
  const labels = adminLabels.tickets

  return (
    <div className="flex flex-col gap-4 p-5 border-b border-border-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface-panel text-brand-400 border border-border-subtle">
            <Icon name="document" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{labels.pageTitle}</h2>
            <p className="text-xs text-gray-400">
              {total} {labels.records}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <TextInput
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-8"
            aria-label={labels.searchPlaceholder}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar: Date range */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border-subtle/50 text-xs text-gray-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label htmlFor="ticket-date-from" className="cursor-pointer">
              {labels.dateFromLabel}
            </label>
            <input
              id="ticket-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              aria-label={labels.dateFromLabel}
              className="bg-surface-panel text-gray-200 border border-border-default rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label htmlFor="ticket-date-to" className="cursor-pointer">
              {labels.dateToLabel}
            </label>
            <input
              id="ticket-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              aria-label={labels.dateToLabel}
              className="bg-surface-panel text-gray-200 border border-border-default rounded-lg px-2.5 py-1.5 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            {labels.clearFilters}
          </Button>
        )}
      </div>
    </div>
  )
}
