<<<<<<< HEAD
import { AdminLayout } from '../components/AdminLayout'
import { useAdminUIStore } from '../stores/adminUIStore'

export function AdminLayoutContainer() {
  const isSidebarOpen = useAdminUIStore(state => state.isSidebarOpen)
  const toggleSidebar = useAdminUIStore(state => state.toggleSidebar)

  return (
    <AdminLayout 
=======
import { useVehicles } from '../hooks/useVehicles'
import { useSpots } from '../hooks/useSpots'
import { AdminLayout } from '../components/AdminLayout'
import { useAdminUIStore } from '../stores/adminUIStore'
import { DEFAULT_TOTAL_SPOTS } from '../constants'

export function AdminLayoutContainer() {
  const { data: vehicles } = useVehicles()
  const { data: spots } = useSpots()
  const isSidebarOpen = useAdminUIStore(state => state.isSidebarOpen)
  const toggleSidebar = useAdminUIStore(state => state.toggleSidebar)

  const occupiedSpots = spots?.filter(s => s.status === 'OCCUPIED').length || 0
  const totalSpots = spots?.length || DEFAULT_TOTAL_SPOTS
  const totalRegisteredVehicles = vehicles?.length || 0

  return (
    <AdminLayout 
      occupiedSpots={occupiedSpots}
      totalSpots={totalSpots}
      totalRegisteredVehicles={totalRegisteredVehicles}
>>>>>>> origin/release
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  )
}
