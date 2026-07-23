import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
<<<<<<< HEAD
=======
  occupiedSpots: number;
  totalSpots: number;
  totalRegisteredVehicles: number;
>>>>>>> origin/release
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function AdminLayout({ 
<<<<<<< HEAD
=======
  occupiedSpots, 
  totalSpots, 
  totalRegisteredVehicles, 
>>>>>>> origin/release
  isSidebarOpen, 
  toggleSidebar, 
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-surface-app text-gray-100 overflow-hidden font-sans">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
<<<<<<< HEAD
      />
      <main className="flex-1 overflow-y-auto bg-surface-app p-4 lg:p-6 xl:p-8">
=======
        occupiedSpots={occupiedSpots}
        totalSpots={totalSpots}
        totalRegisteredVehicles={totalRegisteredVehicles}
      />
      <main className="flex-1 overflow-y-auto bg-surface-app p-8">
>>>>>>> origin/release
        <Outlet />
      </main>
    </div>
  )
}
