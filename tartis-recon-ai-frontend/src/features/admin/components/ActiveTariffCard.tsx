import { useState, useMemo } from 'react'
import { useActiveTariff } from '../hooks/useActiveTariff'
import { useTariffs } from '../hooks/useTariffs'
import type { VehicleType } from '../types/tariff'
import { adminLabels } from '../labels'
import { Select, LoadingSpinner, Icon } from '@/shared/ui'
import { getVehicleTypeLabel, getAvailableVehicleTypes } from '../utils/vehicleTypeUtils'

export function ActiveTariffCard() {
  const [selectedType, setSelectedType] = useState<VehicleType>('CAR')
  const { data: allTariffs } = useTariffs()
  const { data: activeTariff, isLoading, isError } = useActiveTariff(selectedType)
  const labels = adminLabels.tariffs.activeTariffLookup

  const vehicleOptions = useMemo(() => {
    const tariffTypes = allTariffs?.map((t) => t.type) ?? []
    const availableTypes = getAvailableVehicleTypes(tariffTypes)
    return availableTypes.map((type) => ({
      value: type,
      label: getVehicleTypeLabel(type),
    }))
  }, [allTariffs])

  return (
    <div className="bg-surface-card border border-border-subtle rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Icon name="document" className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-white">{labels.title}</h3>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="vehicle-type-select" className="text-xs text-gray-400 whitespace-nowrap">
            {labels.selectLabel}
          </label>
          <div className="w-full sm:w-48">
            <Select
              id="vehicle-type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as VehicleType)}
            >
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
          <LoadingSpinner />
          <span>{labels.loading}</span>
        </div>
      )}

      {isError && (
        <div className="py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {labels.error}
        </div>
      )}

      {!isLoading && !isError && !activeTariff && (
        <div className="py-3 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          {labels.notFound}
        </div>
      )}

      {!isLoading && !isError && activeTariff && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-app p-4 rounded-lg border border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white text-lg">{activeTariff.name}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {labels.activeBadge}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">ID: {activeTariff.id}</span>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{labels.basePrice}</span>
              <span className="text-white font-bold text-base">{activeTariff.basePrice.toFixed(2)} €</span>
            </div>
            <div className="h-8 w-px bg-border-subtle hidden sm:block"></div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{labels.pricePerMinute}</span>
              <span className="text-white font-bold text-base">{activeTariff.pricePerMinute.toFixed(2)} €/min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
