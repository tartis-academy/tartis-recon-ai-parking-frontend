import { useVehicles } from '../hooks/useVehicles'
import { VehicleTable } from '../components/VehicleTable'
import { PageHeader } from '@/shared/ui'
import { adminLabels } from '../labels'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()

  if (isLoading) {
    return <div className="text-gray-400 p-8">{adminLabels.vehicles.loading}</div>
  }

  if (isError) {
    return <div className="text-state-error p-8">{adminLabels.vehicles.error}</div>
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <PageHeader 
        title={adminLabels.vehicles.pageTitle} 
        subtitle={adminLabels.vehicles.pageSubtitle} 
      />
      <VehicleTable vehicles={vehicles ?? []} />
    </div>
  )
}
