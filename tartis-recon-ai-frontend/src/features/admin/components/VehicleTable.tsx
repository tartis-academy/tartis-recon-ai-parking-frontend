import { useVehicles } from '../hooks/useVehicles'
import { Link } from '@tanstack/react-router'

export default function VehicleTable() {
  const { data: vehicles, isLoading, error } = useVehicles()

  if (isLoading) return <p className="text-gray-400">Cargando...</p>
  if (error) return <p className="text-red-400">Error al cargar los vehículos.</p>

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Vehículos</h1>
        <p className="text-sm text-gray-400">Administración · Vehículos</p>
      </div>
      
      <div className="bg-[#161b22] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Table Header / Toolbar */}
        <div className="p-5 border-b border-gray-800 flex flex-wrap gap-4 justify-between items-center bg-[#161b22]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Vehículos</h2>
            <span className="bg-[#1f2937] text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">
              {vehicles?.length || 0} registros
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/admin/vehicles/new">
              <button className="bg-teal-500 hover:bg-teal-400 text-black font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo vehículo
              </button>
            </Link>
          </div>
        </div>
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#0b0e14]/50 border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="p-5">ID</th>
                <th className="p-5">Matrícula</th>
                <th className="p-5">Marca / Modelo</th>
                <th className="p-5">Tipo</th>
                <th className="p-5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {vehicles?.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-[#1f2937]/50 transition-colors duration-200 text-sm">
                  <td className="p-5 text-gray-500">VHC-{vehicle.id}</td>
                  <td className="p-5 font-bold text-gray-200">{vehicle.plate}</td>
                  <td className="p-5 text-gray-300">{vehicle.brand} {vehicle.model}</td>
                  <td className="p-5 text-gray-400">
                    <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-gray-800 border border-gray-700 text-gray-300">
                      {vehicle.type === 'CAR' ? 'Coche' : vehicle.type === 'CAR_PMR' ? 'Coche PMR' : 'Moto'}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {vehicle.isParked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-emerald-900 bg-emerald-500/10 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Estacionado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-700 bg-gray-800 text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                        Fuera
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {vehicles?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No hay vehículos registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
