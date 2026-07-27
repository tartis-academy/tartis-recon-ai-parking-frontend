import type { StayStatusFilter, StayVehicleTypeFilter } from '../types/stay'
import { TextInput, Select, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

interface StayTableToolbarProps {
  search: string
  status: StayStatusFilter
  vehicleType: StayVehicleTypeFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: StayStatusFilter) => void
  onVehicleTypeChange: (value: StayVehicleTypeFilter) => void
}

export function StayTableToolbar({
  search,
  status,
  vehicleType,
  onSearchChange,
  onStatusChange,
  onVehicleTypeChange,
}: StayTableToolbarProps) {
  const labels = adminLabels.stays

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="w-full sm:w-56 min-w-[180px]">
        <TextInput
          icon={<Icon name="search" />}
          placeholder={labels.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:min-w-[13rem] sm:w-52">
        <Select
          icon={<Icon name="filter" />}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StayStatusFilter)}
          aria-label={labels.filterByStatus}
        >
          <option value="ALL">{labels.filterAll}</option>
          <option value="IN_PROGRESS">{labels.status.inProgress}</option>
          <option value="FINISHED">{labels.status.finished}</option>
          <option value="CANCELLED">{labels.status.cancelled}</option>
        </Select>
      </div>
      <div className="w-full sm:min-w-[12rem] sm:w-48">
        <Select
          icon={<Icon name="filter" />}
          value={vehicleType}
          onChange={(e) => onVehicleTypeChange(e.target.value as StayVehicleTypeFilter)}
          aria-label={labels.filterByVehicleType}
        >
          <option value="ALL">{labels.filterAllVehicleTypes}</option>
          <option value="CAR">{labels.vehicleTypes.CAR}</option>
          <option value="CAR_PMR">{labels.vehicleTypes.CAR_PMR}</option>
          <option value="MOTORBIKE">{labels.vehicleTypes.MOTORBIKE}</option>
        </Select>
      </div>
    </div>
  )
}
