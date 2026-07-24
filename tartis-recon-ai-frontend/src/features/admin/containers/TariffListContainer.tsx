import { useState } from 'react'
import { useTariffs } from '../hooks/useTariffs'
import { useToggleTariffStatus } from '../hooks/useToggleTariffStatus'
import { useDeleteTariff } from '../hooks/useDeleteTariff'
import { TariffTable } from '../components/TariffTable'
import { TariffForm } from '../components/TariffForm'
import { adminLabels } from '../labels'
import { PageHeader, Button, Icon, LoadingSpinner, ErrorMessage } from '@/shared/ui'

export function TariffListContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: tariffs, isLoading, isError } = useTariffs()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleTariffStatus()
  const { mutate: deleteTariff, isPending: isDeleting } = useDeleteTariff()

  const { tariffs: labels } = adminLabels

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage>{labels.error}</ErrorMessage>

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <PageHeader
        title={labels.pageTitle}
        subtitle={labels.pageSubtitle}
        action={
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Icon name="plus" className="w-4 h-4" />}
          >
            {labels.createTariff}
          </Button>
        }
      />

      <TariffTable
        tariffs={tariffs ?? []}
        onToggleStatus={(id) => toggleStatus(id)}
        onDelete={(id) => deleteTariff(id)}
        isToggling={isToggling}
        isDeleting={isDeleting}
      />

      {isModalOpen && <TariffForm onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
