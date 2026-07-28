import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './AdminSidebar'
import type { ConnectionStatus } from '@/shared/hooks/useRealtimeSync'

interface AdminLayoutProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  realtimeStatus: ConnectionStatus;
}

const statusConfig: Record<ConnectionStatus, { label: string; colorClass: string; animate?: boolean }> = {
  unconfigured: { label: 'Live updates unavailable', colorClass: 'text-gray-400' },
  connecting: { label: 'Connecting...', colorClass: 'text-amber-400', animate: true },
  connected: { label: 'Live updates active', colorClass: 'text-green-400' },
  reconnecting: { label: 'Reconnecting...', colorClass: 'text-amber-400', animate: true },
  error: { label: 'Live updates unavailable', colorClass: 'text-red-400' },
}

export function AdminLayout({ 
  isSidebarOpen, 
  toggleSidebar, 
  realtimeStatus,
}: AdminLayoutProps) {
  const { label, colorClass, animate } = statusConfig[realtimeStatus]

  return (
    <div className="flex h-screen bg-surface-app text-gray-100 overflow-hidden font-sans">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="flex-1 overflow-y-auto bg-surface-app p-4 lg:p-6 xl:p-8">
        <div className="flex justify-end mb-4">
          <span
            className={`inline-flex items-center text-xs ${colorClass}`}
            aria-live="polite"
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${colorClass.replace('text-', 'bg-')} ${animate ? 'animate-pulse' : ''}`}
            />
            {label}
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
