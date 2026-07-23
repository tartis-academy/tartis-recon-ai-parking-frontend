import { Button, EmptyState } from '@/shared/ui'
import { adminLabels } from '../labels'

interface StayTableEmptyStateProps {
  hasActiveFilters: boolean
  labels: typeof adminLabels.stays
  onClearFilters: () => void
  colSpan?: number
}

export function StayTableEmptyState({ hasActiveFilters, labels, onClearFilters, colSpan }: StayTableEmptyStateProps) {
  return (
    <EmptyState colSpan={colSpan}>
      <div className="flex flex-col items-center gap-3">
        <span>{hasActiveFilters ? labels.noResults : labels.emptyState}</span>
        {hasActiveFilters && (
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            {labels.clearFilters}
          </Button>
        )}
      </div>
    </EmptyState>
  )
}
