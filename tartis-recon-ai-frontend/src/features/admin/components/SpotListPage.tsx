import { useSpots } from '../hooks/useSpots'
import { SpotTable } from './SpotTable'

export const SpotListPage = () => {
  const { data: spots, isLoading, isError } = useSpots()

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Plazas</h1>
        <p className="text-sm text-gray-400">Administración · Plazas</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Ha ocurrido un error al cargar las plazas. Por favor, inténtalo de nuevo.
        </div>
      )}

      {spots && !isLoading && !isError && (
        <SpotTable spots={spots} />
      )}
    </div>
  )
}
