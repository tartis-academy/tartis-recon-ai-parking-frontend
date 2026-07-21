import { useState } from 'react'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useVehicles } from '../hooks/useVehicles'
import { useSpots } from '../hooks/useSpots'

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  
  const { data: vehicles } = useVehicles()
  const { data: spots } = useSpots()

  const occupiedSpots = spots?.filter(s => s.status === 'OCCUPIED').length || 0
  const totalSpots = spots?.length || 120
  const totalRegisteredVehicles = vehicles?.length || 0

  return (
    <div className="flex h-screen bg-[#0b0e14] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#111827] border-r border-gray-800 transition-all duration-300 flex flex-col relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 bg-gray-800 border border-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500 z-10 transition-colors"
        >
          <svg className={`w-4 h-4 transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="min-w-10 w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="font-bold text-lg text-white">ParkingOps</span>
              <span className="text-xs text-gray-500">Panel de administración</span>
            </div>
          )}
        </div>

        {/* Navigation Area */}
        <div className="flex-1 px-3 py-6 overflow-y-auto">
          {isSidebarOpen && <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Gestión</h3>}
          <nav className="space-y-1">
            <Link
              to="/admin/vehicles"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                location.pathname.includes('/vehicles')
                  ? 'bg-[#1f2937] text-emerald-400 border-l-2 border-emerald-500 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border-l-2 border-transparent'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="font-medium whitespace-nowrap">Vehículos</span>
                  <span className="text-[10px] font-bold bg-[#111827] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                    {occupiedSpots}/{totalRegisteredVehicles || 400}
                  </span>
                </div>
              )}
            </Link>

            <Link
              to="/admin/spots"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                location.pathname.includes('/spots')
                  ? 'bg-[#1f2937] text-emerald-400 border-l-2 border-emerald-500 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border-l-2 border-transparent'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="font-medium whitespace-nowrap">Plazas</span>
                  <span className="text-[10px] font-bold bg-[#111827] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                    {occupiedSpots}/{totalSpots}
                  </span>
                </div>
              )}
            </Link>
          </nav>
        </div>

        {/* User Profile Area */}
        <div className="p-4 border-t border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            AO
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="font-semibold text-sm">Álvaro Orta</span>
              <span className="text-xs text-gray-500">Administrador</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-8">
        <Outlet />
      </main>
    </div>
  )
}
