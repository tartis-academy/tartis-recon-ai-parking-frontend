import type { Spot } from '../types/spot'

interface SpotTableProps {
  spots: Spot[];
}

export const SpotTable = ({ spots }: SpotTableProps) => {
  return (
    <div className="bg-[#161b22] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
      {/* Header/Toolbar */}
      <div className="p-5 border-b border-gray-800 flex flex-wrap gap-4 justify-between items-center bg-[#161b22]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Plazas</h2>
          <span className="bg-[#1f2937] text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">
            {spots.length} registros
          </span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#0b0e14] px-4 py-2 rounded-lg border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Libres
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#0b0e14] px-4 py-2 rounded-lg border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Ocupadas
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#0b0e14]/50 border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-5">ID / N.º Plaza</th>
              <th className="p-5">Tipo</th>
              <th className="p-5 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {spots.map((spot) => (
              <tr key={spot.id} className="hover:bg-[#1f2937]/50 transition-colors duration-200 text-sm">
                <td className="p-5 font-bold text-gray-200">{spot.id}</td>
                <td className="p-5 text-gray-400">
                  <span className="inline-flex px-3 py-1 rounded-md text-xs font-medium bg-gray-800 border border-gray-700 text-gray-300">
                    {spot.type === 'CAR' ? 'Estándar' : spot.type === 'CAR_PMR' ? 'Discapacitados' : 'Moto'}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    spot.status === 'AVAILABLE' ? 'border-emerald-900 bg-emerald-500/10 text-emerald-400' :
                    spot.status === 'OCCUPIED' ? 'border-yellow-900 bg-yellow-500/10 text-yellow-400' :
                    'border-gray-700 bg-gray-800 text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      spot.status === 'AVAILABLE' ? 'bg-emerald-500' :
                      spot.status === 'OCCUPIED' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}></span>
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
    </div>
  )
}
