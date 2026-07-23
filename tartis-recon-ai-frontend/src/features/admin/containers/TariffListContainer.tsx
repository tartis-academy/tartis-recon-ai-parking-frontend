import { useState } from 'react'
import { useTariffs } from '../hooks/useTariffs'
import { useDeleteTariff } from '../hooks/useDeleteTariff'
import { useToggleTariffStatus } from '../hooks/useToggleTariffStatus'
import { TariffTable } from '../components/TariffTable'
import { TariffDeleteConfirmModal } from '../components/TariffDeleteConfirmModal'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { adminLabels } from '../labels'
import type { Tariff } from '../types/tariff'

export function TariffListContainer() {
  const { data: tariffs, isLoading, isError } = useTariffs()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteTariff()
  const { mutate: toggleMutate } = useToggleTariffStatus()

  const [selectedTariffToDelete, setSelectedTariffToDelete] = useState<Tariff | null>(null)

  const handleToggleStatus = (id: string, active: boolean) => {
    toggleMutate({ id, active })
  }

  const handleDeleteConfirm = () => {
    if (!selectedTariffToDelete) return
    deleteMutate(selectedTariffToDelete.id, {
      onSuccess: () => {
        setSelectedTariffToDelete(null)
      },
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.tariffs.error}</ErrorMessage>
  }

  return (
    <>
      <TariffTable
        tariffs={tariffs ?? []}
        onToggleStatus={handleToggleStatus}
        onDeleteRequest={(tariff) => setSelectedTariffToDelete(tariff)}
      />

      {selectedTariffToDelete && (
        <TariffDeleteConfirmModal
          tariff={selectedTariffToDelete}
          onClose={() => setSelectedTariffToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </>
  )
}
