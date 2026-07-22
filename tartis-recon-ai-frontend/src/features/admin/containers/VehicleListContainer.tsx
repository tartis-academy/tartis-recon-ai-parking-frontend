import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleTable } from '../components/VehicleTable'
import { PageHeader, LoadingSpinner, ErrorMessage, Button, Icon } from '@/shared/ui'
import { adminLabels } from '../labels'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PARKED' | 'OUTSIDE'>('ALL')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.vehicles.error}</ErrorMessage>
  }
  
  // TODO: Migrar filtrado a query params del router / backend cuando crezca el dataset
  // Filtrar localmente
  const filteredVehicles = (vehicles ?? []).filter((v) => {
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
      />
      <VehicleTable 
        vehicles={filteredVehicles}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        primaryAction={
          <Link to="/admin/vehicles/new">
            <Button variant="primary" icon={<Icon name="plus" />}>
              {adminLabels.vehicles.newVehicle}
            </Button>
          </Link>
        }
      />
    </div>
  )
}
