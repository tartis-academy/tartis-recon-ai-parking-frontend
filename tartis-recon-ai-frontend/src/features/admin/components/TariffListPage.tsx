import { useState } from 'react'
import { TariffForm } from './TariffForm'
import { TariffListContainer } from '../containers/TariffListContainer'
import { adminLabels } from '../labels'
import { PageHeader, Button, Icon } from '@/shared/ui'

export const TariffListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { tariffs } = adminLabels

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in flex flex-col gap-6">
      {/* Header con botón de Crear Tarifa al mismo nivel */}
      <PageHeader
        title={tariffs.pageTitle}
        subtitle={tariffs.pageSubtitle}
        action={
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Icon name="plus" className="w-4 h-4" />}
          >
            {tariffs.createTariff}
          </Button>
        }
      />

      {/* Contenedor del Listado de Tarifas */}
      <TariffListContainer />

      {/* Modal de Formulario de Tarifa */}
      {isModalOpen && <TariffForm onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
