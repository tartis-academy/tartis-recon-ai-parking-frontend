import { useState } from 'react'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleTable } from '../components/VehicleTable'
import { PageHeader } from '@/shared/ui'
import { adminLabels } from '../labels'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PARKED' | 'OUTSIDE'>('ALL')

  if (isLoading) {
    return <div className="text-gray-400 p-8">{adminLabels.vehicles.loading}</div>
  }

  if (isError) {
    return <div className="text-state-error p-8">{adminLabels.vehicles.error}</div>
  }
  
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
      />
    </div>
  )
}
