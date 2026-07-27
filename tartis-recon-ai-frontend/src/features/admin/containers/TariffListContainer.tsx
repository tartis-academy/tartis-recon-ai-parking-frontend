import { useState } from 'react'
import { useTariffs } from '../hooks/useTariffs'
import { useToggleTariffStatus } from '../hooks/useToggleTariffStatus'
import { useDeleteTariff } from '../hooks/useDeleteTariff'
import { useCreateTariff } from '../hooks/useCreateTariff'
import { useUpdateTariff } from '../hooks/useUpdateTariff'
import { TariffTable } from '../components/TariffTable'
import { TariffForm } from '../components/TariffForm'
import { adminLabels } from '../labels'
import type { Tariff } from '../types/tariff'
import type { TariffFormData } from '../validation/tariffSchema'
import { PageHeader, Button, Icon, LoadingSpinner, ErrorMessage } from '@/shared/ui'

export function TariffListContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null)

  const { data: tariffs, isLoading, isError } = useTariffs()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleTariffStatus()
  const { mutate: deleteTariff, isPending: isDeleting } = useDeleteTariff()
  const { mutate: createTariff, isPending: isCreating } = useCreateTariff()
  const { mutate: updateTariff, isPending: isUpdating } = useUpdateTariff()

  const { tariffs: labels } = adminLabels

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTariff(null)
  }

  const handleOpenCreateModal = () => {
    setEditingTariff(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (tariff: Tariff) => {
    setIsModalOpen(false)
    setEditingTariff(tariff)
  }

  const handleSubmit = (data: TariffFormData) => {
    if (editingTariff) {
      updateTariff(
        {
          id: editingTariff.id,
          data: {
            name: data.name,
            type: data.type,
            basePrice: data.basePrice,
            pricePerMinute: data.pricePerMinute,
            active: editingTariff.active,
          },
        },
        {
          onSuccess: handleCloseModal,
        },
      )
    } else {
      createTariff(
        { ...data, active: true },
        {
          onSuccess: handleCloseModal,
        },
      )
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage>{labels.error}</ErrorMessage>

  const isFormVisible = isModalOpen || Boolean(editingTariff)

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <PageHeader
        title={labels.pageTitle}
        subtitle={labels.pageSubtitle}
        action={
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            icon={<Icon name="plus" className="w-4 h-4" />}
          >
            {labels.createTariff}
          </Button>
        }
      />

      <TariffTable
        tariffs={tariffs ?? []}
        onEdit={handleOpenEditModal}
        onToggleStatus={(id, active) => toggleStatus({ id, active })}
        onDelete={(id) => deleteTariff(id)}
        isToggling={isToggling}
        isDeleting={isDeleting}
      />

      {isFormVisible && (
        <TariffForm
          key={editingTariff?.id ?? (isModalOpen ? 'create-new-tariff' : 'idle')}
          tariffToEdit={editingTariff}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </div>
  )
}
