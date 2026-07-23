import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
  occupiedSpots?: number;
  totalSpots?: number;
  totalRegisteredVehicles?: number;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function AdminLayout({ 
  occupiedSpots, 
  totalSpots, 
  totalRegisteredVehicles, 
  isSidebarOpen, 
  toggleSidebar, 
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-surface-app text-gray-100 overflow-hidden font-sans">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        occupiedSpots={occupiedSpots}
        totalSpots={totalSpots}
        totalRegisteredVehicles={totalRegisteredVehicles}
      />
      <main className="flex-1 overflow-y-auto bg-surface-app p-4 lg:p-6 xl:p-8">
        <Outlet />
      </main>
    </div>
  )
}
