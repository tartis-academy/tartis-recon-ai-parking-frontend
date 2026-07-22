import { useSpots } from '../hooks/useSpots'
import { SpotTable } from '../components/SpotTable'
import { PageHeader } from '@/shared/ui'
import { adminLabels } from '../labels'

export function SpotListContainer() {
  const { data: spots, isLoading, isError } = useSpots()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-state-error/10 text-state-error border border-state-error/20 p-4 rounded-xl flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        {adminLabels.spots.error}
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <PageHeader 
        title={adminLabels.spots.pageTitle} 
        subtitle={adminLabels.spots.pageSubtitle} 
      />
      {spots && <SpotTable spots={spots} />}
    </div>
  )
}
