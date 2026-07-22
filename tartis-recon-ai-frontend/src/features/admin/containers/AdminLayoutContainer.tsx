import { useVehicles } from '../hooks/useVehicles'
import { useSpots } from '../hooks/useSpots'
import { AdminLayout } from '../components/AdminLayout'

export function AdminLayoutContainer() {
  const { data: vehicles } = useVehicles()
  const { data: spots } = useSpots()

  const occupiedSpots = spots?.filter(s => s.status === 'OCCUPIED').length || 0
  const totalSpots = spots?.length || 120
  const totalRegisteredVehicles = vehicles?.length || 0

  return (
    <AdminLayout 
      occupiedSpots={occupiedSpots}
      totalSpots={totalSpots}
      totalRegisteredVehicles={totalRegisteredVehicles}
    />
  )
}
