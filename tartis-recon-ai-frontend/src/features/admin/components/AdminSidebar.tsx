import { Link, useLocation } from '@tanstack/react-router'
import { adminLabels } from '../labels'
import { DEFAULT_TOTAL_VEHICLES } from '../constants'
import { Icon } from '@/shared/ui'

interface AdminSidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  occupiedSpots?: number
  totalSpots?: number
  totalRegisteredVehicles?: number
}

export function AdminSidebar({ 
  isSidebarOpen, 
  toggleSidebar, 
  occupiedSpots = 0, 
  totalSpots = 0, 
  totalRegisteredVehicles = DEFAULT_TOTAL_VEHICLES, 
}: AdminSidebarProps) {
  const location = useLocation()
  const { layout } = adminLabels

  const isVehiclesActive = location.pathname.includes('/vehicles')
  const isSpotsActive = location.pathname.includes('/spots')
  const isTariffsActive = location.pathname.includes('/tariffs')
  const isStaysActive = location.pathname.includes('/stays')
  const isTicketsActive = location.pathname.includes('/tickets')

  return (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-surface-panel border-r border-border-subtle transition-all duration-300 flex flex-col relative`}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? layout.collapseSidebar : layout.expandSidebar}
        className="absolute -right-3 top-8 bg-surface-card border border-border-default rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500 z-10 transition-colors"
      >
        <Icon name="chevron-right" className={`w-4 h-4 transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className="p-6 flex items-center gap-3">
        <div className="min-w-10 w-10 h-10 rounded-xl bg-brand-soft text-brand-400 flex items-center justify-center shadow-brand-glow flex-shrink-0">
          <Icon name="document" className="w-6 h-6" />
        </div>
        {isSidebarOpen && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden">
            <span className="font-bold text-lg text-white">{layout.logo}</span>
            <span className="text-xs text-gray-500">{layout.subtitle}</span>
          </div>
        )}
      </div>

      <div className="flex-1 px-3 py-6 overflow-y-auto">
        {isSidebarOpen && <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{layout.menuSection}</h3>}
        <nav aria-label={layout.menuSection} className="space-y-1">
          <Link
            to="/admin/vehicles"
            aria-current={isVehiclesActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isVehiclesActive
                ? 'bg-surface-row-hover text-brand-400 border-l-2 border-brand-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-card border-l-2 border-transparent'
            }`}
          >
            <Icon name="search" className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="flex items-center justify-between flex-1 overflow-hidden">
                <span className="font-medium whitespace-nowrap">{layout.vehicles}</span>
                <span className="text-[10px] font-bold bg-surface-panel text-gray-400 px-2 py-0.5 rounded-full border border-border-default">
                  {occupiedSpots}/{totalRegisteredVehicles || DEFAULT_TOTAL_VEHICLES}
                </span>
              </div>
            )}
          </Link>

          <Link
            to="/admin/spots"
            aria-current={isSpotsActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isSpotsActive
                ? 'bg-surface-row-hover text-brand-400 border-l-2 border-brand-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-card border-l-2 border-transparent'
            }`}
          >
            <Icon name="grid" className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="flex items-center justify-between flex-1 overflow-hidden">
                <span className="font-medium whitespace-nowrap">{layout.spots}</span>
                <span className="text-[10px] font-bold bg-surface-panel text-gray-400 px-2 py-0.5 rounded-full border border-border-default">
                  {occupiedSpots}/{totalSpots}
                </span>
              </div>
            )}
          </Link>

          <Link
            to="/admin/tariffs"
            aria-current={isTariffsActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isTariffsActive
                ? 'bg-surface-row-hover text-brand-400 border-l-2 border-brand-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-card border-l-2 border-transparent'
            }`}
          >
            <Icon name="document" className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="flex items-center justify-between flex-1 overflow-hidden">
                <span className="font-medium whitespace-nowrap">{layout.tariffs}</span>
              </div>
            )}
          </Link>

          <Link
            to="/admin/stays"
            aria-current={isStaysActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isStaysActive
                ? 'bg-surface-row-hover text-brand-400 border-l-2 border-brand-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-card border-l-2 border-transparent'
            }`}
          >
            <Icon name="clock" className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap">{layout.stays}</span>
            )}
          </Link>

          <Link
            to="/admin/tickets"
            aria-current={isTicketsActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isTicketsActive
                ? 'bg-surface-row-hover text-brand-400 border-l-2 border-brand-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-card border-l-2 border-transparent'
            }`}
          >
            <Icon name="document" className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap">{layout.tickets}</span>
            )}
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-border-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center font-bold text-sm flex-shrink-0 border border-border-default">
          {layout.adminName.split(' ').map(n => n[0]).join('')}
        </div>
        {isSidebarOpen && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden">
            <span className="font-semibold text-sm">{layout.adminName}</span>
            <span className="text-xs text-gray-500">{layout.adminRole}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
