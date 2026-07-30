import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useVehicles } from '../hooks/useVehicles'
import { useToggleVehicleStatus } from '../hooks/useToggleVehicleStatus'
import { useUpdateVehicle } from '../hooks/useUpdateVehicle'
import { VehicleTable } from '../components/VehicleTable'
import { VehicleStatusModal } from '../components/VehicleStatusModal'
import { VehicleForm } from '../components/VehicleForm'
import { PageHeader, LoadingSpinner, ErrorMessage, Button, Icon } from '@/shared/ui'
import { useToastStore } from '@/shared/stores/useToastStore'
import { adminLabels } from '../labels'
import type { Vehicle } from '../types/vehicle'
import type { VehicleFormData } from '../validation/vehicleSchema'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  const { mutate: toggleVehicle, isPending: isToggling } = useToggleVehicleStatus()
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle()
  const addToast = useToastStore((s) => s.addToast)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicleToConfirm, setVehicleToConfirm] = useState<Vehicle | null>(null)
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null)

  const handleConfirm = () => {
    if (!vehicleToConfirm) return
    const isDeactivating = vehicleToConfirm.active
    toggleVehicle(vehicleToConfirm, {
      onSuccess: () => {
        setVehicleToConfirm(null)
        addToast({ 
          type: 'success', 
          message: isDeactivating 
            ? adminLabels.vehicles.actions.deactivateSuccess 
            : adminLabels.vehicles.actions.activateSuccess, 
        })
      },
      onError: () => addToast({ type: 'error', message: adminLabels.vehicles.actions.errorUpdate }),
    })
  }

  const handleEditSubmit = (data: VehicleFormData) => {
    const targetId = vehicleToEdit?.id || vehicleToEdit?.uniqueId
    if (!vehicleToEdit || !targetId) return

    updateVehicle(
      { id: targetId, data },
      {
        onSuccess: () => {
          setVehicleToEdit(null)
          addToast({ 
            type: 'success', 
            message: `${adminLabels.vehicles.pageTitle.slice(0, -1)} ${data.plate} ${adminLabels.vehicles.actions.updateSuccess}`, 
          })
        },
        onError: () => {
          addToast({ type: 'error', message: adminLabels.vehicles.actions.updateError })
        },
      },
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.vehicles.error}</ErrorMessage>
  }
  
  // TODO: Migrar filtrado a query params del router / backend cuando crezca el dataset
  const vehicleList = Array.isArray(vehicles) ? vehicles : []
  const filteredVehicles = vehicleList
    .filter((v) => v.plate.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.plate.localeCompare(b.plate, undefined, { numeric: true, sensitivity: 'base' }))

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
        onToggleStatus={setVehicleToConfirm}
        onEdit={(vehicle) => setVehicleToEdit(vehicle)}
      />
      
      <VehicleStatusModal
        isOpen={!!vehicleToConfirm}
        vehicle={vehicleToConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setVehicleToConfirm(null)}
        isPending={isToggling}
      />

      {vehicleToEdit && (
        <VehicleForm
          initialValues={vehicleToEdit}
          onSubmit={handleEditSubmit}
          onClose={() => setVehicleToEdit(null)}
          isPending={isUpdating}
        />
      )}
    </div>
  )
}
