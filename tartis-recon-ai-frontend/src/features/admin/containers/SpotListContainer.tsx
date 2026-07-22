import { useSpots } from '../hooks/useSpots'
import { SpotTable } from '../components/SpotTable'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { adminLabels } from '../labels'

export function SpotListContainer() {
  const { data: spots, isLoading, isError } = useSpots()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.spots.error}</ErrorMessage>
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
