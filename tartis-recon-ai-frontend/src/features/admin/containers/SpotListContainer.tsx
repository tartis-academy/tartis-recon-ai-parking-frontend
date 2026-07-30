import { useState } from 'react'
import { useSpots } from '../hooks/useSpots'
import { useUpdateSpotStatus } from '../hooks/useUpdateSpotStatus'
import { SpotTable } from '../components/SpotTable'
import { SpotMaintenanceModal } from '../components/SpotMaintenanceModal'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { useToastStore } from '@/shared/stores/useToastStore'
import { adminLabels } from '../labels'
import type { Spot } from '../types/spot'

export function SpotListContainer() {
  const [spotToConfirm, setSpotToConfirm] = useState<Spot | null>(null)
  
  const { data: spots, isLoading, isError } = useSpots()
  const { mutate: updateSpot, isPending } = useUpdateSpotStatus()
  const addToast = useToastStore((s) => s.addToast)

  const handleConfirm = () => {
    if (!spotToConfirm) return
    const newStatus = spotToConfirm.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE'
    updateSpot(
      { id: spotToConfirm.id, status: newStatus },
      { 
        onSuccess: () => setSpotToConfirm(null),
        onError: () => addToast({ type: 'error', message: adminLabels.spots.maintenance.errorUpdate }),
      },
    )
  }

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
      {spots && (
        <SpotTable 
          spots={spots} 
          onToggleMaintenance={setSpotToConfirm} 
        />
      )}
      
      <SpotMaintenanceModal
        isOpen={!!spotToConfirm}
        spot={spotToConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setSpotToConfirm(null)}
        isPending={isPending}
      />
    </div>
  )
}
