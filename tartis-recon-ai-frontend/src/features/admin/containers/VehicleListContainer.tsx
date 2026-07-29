import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useVehicles } from '../hooks/useVehicles'
import { useToggleVehicleStatus } from '../hooks/useToggleVehicleStatus'
import { VehicleTable } from '../components/VehicleTable'
import { VehicleStatusModal } from '../components/VehicleStatusModal'
import { PageHeader, LoadingSpinner, ErrorMessage, Button, Icon } from '@/shared/ui'
import { useToastStore } from '@/shared/stores/useToastStore'
import { adminLabels } from '../labels'
import type { StatusFilter, Vehicle } from '../types/vehicle'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  const { mutate: toggleVehicle, isPending } = useToggleVehicleStatus()
  const { addToast } = useToastStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [vehicleToConfirm, setVehicleToConfirm] = useState<Vehicle | null>(null)

  const handleConfirm = () => {
    if (!vehicleToConfirm || !vehicleToConfirm.uniqueId) return
    toggleVehicle(vehicleToConfirm.uniqueId, {
      onSuccess: () => setVehicleToConfirm(null),
      onError: () => addToast({ type: 'error', message: adminLabels.vehicles.actions.errorUpdate }),
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.vehicles.error}</ErrorMessage>
  }
  
  // TODO: Migrar filtrado a query params del router / backend cuando crezca el dataset
  const vehicleList = Array.isArray(vehicles) ? vehicles : []
  const filteredVehicles = vehicleList.filter((v) => {
    const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'ALL' ? true :
      statusFilter === 'PARKED' ? v.isParked === true :
      v.isParked === false

    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <PageHeader 
        title={adminLabels.vehicles.pageTitle} 
        subtitle={adminLabels.vehicles.pageSubtitle}
        action={
          <Link to="/admin/vehicles/new">
            <Button variant="primary" icon={<Icon name="plus" />}>
              {adminLabels.vehicles.newVehicle}
            </Button>
          </Link>
        }
      />
      <VehicleTable 
        vehicles={filteredVehicles}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onToggleStatus={setVehicleToConfirm}
      />
      
      <VehicleStatusModal
        isOpen={!!vehicleToConfirm}
        vehicle={vehicleToConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setVehicleToConfirm(null)}
        isPending={isPending}
      />
    </div>
  )
}
