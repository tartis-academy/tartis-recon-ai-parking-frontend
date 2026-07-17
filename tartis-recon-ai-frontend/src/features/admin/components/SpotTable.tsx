import type { Spot } from '../types/spot'

interface SpotTableProps {
  spots: Spot[];
}

export const SpotTable = ({ spots }: SpotTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
            <th className="p-4 font-semibold">Número de Plaza</th>
            <th className="p-4 font-semibold">Tipo</th>
            <th className="p-4 font-semibold text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {spots.map((spot) => (
            <tr key={spot.id} className="hover:bg-purple-50/30 transition-colors duration-200">
              <td className="p-4 font-medium text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-sm">
                    {spot.numSpot}
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {spot.type === 'CAR' ? 'Coche' : spot.type === 'CAR_PMR' ? 'Coche PMR' : 'Moto'}
                </span>
              </td>
              <td className="p-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  spot.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-100' :
                  spot.status === 'OCCUPIED' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {spot.status === 'AVAILABLE' ? 'Libre' : spot.status === 'OCCUPIED' ? 'Ocupada' : 'No Disponible'}
                </span>
              </td>
            </tr>
          ))}
          {spots.length === 0 && (
            <tr>
              <td colSpan={3} className="p-8 text-center text-gray-500">
                No hay plazas registradas en el sistema.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
