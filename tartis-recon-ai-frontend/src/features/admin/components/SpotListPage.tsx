import { useSpots } from '../hooks/useSpots'
import { SpotTable } from './SpotTable'

export const SpotListPage = () => {
  const { data: spots, isLoading, isError } = useSpots()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Plazas</h1>
          <p className="text-gray-500 mt-2 text-lg">Administra el estado y disponibilidad de las plazas del parking.</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-100 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Ha ocurrido un error al cargar las plazas. Por favor, inténtalo de nuevo.
          </div>
        )}

        {spots && !isLoading && !isError && (
          <SpotTable spots={spots} />
        )}
      </div>
    </div>
  )
}
