import { AdminLayout } from '../components/AdminLayout'
import { useAdminUIStore } from '../stores/adminUIStore'
import { useRealtimeSync } from '@/shared/hooks/useRealtimeSync'

export function AdminLayoutContainer() {
  const isSidebarOpen = useAdminUIStore(state => state.isSidebarOpen)
  const toggleSidebar = useAdminUIStore(state => state.toggleSidebar)
  const { status } = useRealtimeSync()

  return (
    <AdminLayout 
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      realtimeStatus={status}
    />
  )
}
