import { AdminLayout } from '../components/AdminLayout'
import { useAdminUIStore } from '../stores/adminUIStore'

export function AdminLayoutContainer() {
  const isSidebarOpen = useAdminUIStore(state => state.isSidebarOpen)
  const toggleSidebar = useAdminUIStore(state => state.toggleSidebar)

  return (
    <AdminLayout 
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  )
}
