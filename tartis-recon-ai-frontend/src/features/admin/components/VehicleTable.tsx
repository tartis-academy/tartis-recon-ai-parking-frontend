import { useVehicles } from '../hooks/useVehicles'
import { Link } from '@tanstack/react-router'

export default function VehicleTable() {
  const { data: vehicles, isLoading, error } = useVehicles()

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error al cargar los vehículos.</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Vehículos</h1>
          <Link to="/admin/vehicles/new">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200">
              + Crear vehículo
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Matrícula</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Marca</th>
                <th className="p-4 font-semibold">Modelo</th>
                <th className="p-4 font-semibold">Color</th>
                <th className="p-4 font-semibold">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles?.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-purple-50/30 transition-colors duration-200">
                  <td className="p-4 font-medium text-gray-900">{vehicle.plate}</td>
                  <td className="p-4 text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {vehicle.type === 'CAR' ? 'Coche' : vehicle.type === 'CAR_PMR' ? 'Coche PMR' : 'Moto'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{vehicle.brand}</td>
                  <td className="p-4 text-gray-600">{vehicle.model}</td>
                  <td className="p-4 text-gray-600">{vehicle.color}</td>
                  <td className="p-4 text-gray-600">
                    {vehicle.type === 'CAR' || vehicle.type === 'CAR_PMR'
                      ? `${vehicle.numDoors} puertas`
                      : vehicle.hasSideCar
                        ? 'Con sidecar'
                        : 'Sin sidecar'}
                  </td>
                </tr>
              ))}
              {vehicles?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
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
