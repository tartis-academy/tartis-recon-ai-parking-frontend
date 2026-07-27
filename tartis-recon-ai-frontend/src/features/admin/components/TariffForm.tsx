import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPortal } from 'react-dom'
import { tariffSchema, type TariffFormData } from '../validation/tariffSchema'
import type { Tariff } from '../types/tariff'
import { adminLabels } from '../labels'
import { TextInput, Select, Button, Icon } from '@/shared/ui'

interface TariffFormProps {
  tariffToEdit?: Tariff | null
  onClose: () => void
  onSubmit: (data: TariffFormData) => void
  isPending: boolean
}

export function TariffForm({ tariffToEdit, onClose, onSubmit, isPending }: TariffFormProps) {
  const isEditing = Boolean(tariffToEdit)
  const { form } = adminLabels.tariffs

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema),
    defaultValues: tariffToEdit
      ? {
          name: tariffToEdit.name,
          type: tariffToEdit.type,
          basePrice: tariffToEdit.basePrice,
          pricePerMinute: tariffToEdit.pricePerMinute,
          active: tariffToEdit.active,
        }
      : {
          name: '',
          type: 'CAR',
          basePrice: 1.50,
          pricePerMinute: 0.05,
          active: true,
        },
  })

  const pricePerMinute = useWatch({ control, name: 'pricePerMinute' })
  const estimatedPerHour =
    typeof pricePerMinute === 'number' && !isNaN(pricePerMinute)
      ? (pricePerMinute * 60).toFixed(2)
      : '0.00'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex justify-between items-start bg-surface-card">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {isEditing ? form.editTitle : form.title}
            </h2>
            <p className="text-xs text-gray-400">
              {isEditing ? form.editSubtitle : form.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-white bg-surface-panel hover:bg-surface-row-hover p-1.5 rounded-md transition-colors border border-border-default flex-shrink-0"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          {/* Nombre de la Tarifa */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {form.name} <span className="text-brand-500">*</span>
            </label>
            <TextInput
              id="name"
              {...register('name')}
              placeholder={form.namePlaceholder}
              error={errors.name?.message}
            />
          </div>

          {/* Tipo de Vehículo */}
          <div>
            <label htmlFor="type" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {form.vehicleType} <span className="text-brand-500">*</span>
            </label>
            <Select
              id="type"
              {...register('type')}
              error={errors.type?.message}
            >
              <option value="CAR">{form.types.car}</option>
              <option value="CAR_PMR">{form.types.carPmr}</option>
              <option value="MOTORBIKE">{form.types.motorbike}</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio Base */}
            <div>
              <label htmlFor="basePrice" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {form.basePrice} <span className="text-brand-500">*</span>
              </label>
              <TextInput
                id="basePrice"
                type="number"
                step="0.01"
                min="0.00"
                {...register('basePrice', { valueAsNumber: true })}
                placeholder={form.basePricePlaceholder}
                error={errors.basePrice?.message}
              />
            </div>

            {/* Precio por Minuto */}
            <div>
              <label htmlFor="pricePerMinute" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {form.pricePerMinute} <span className="text-brand-500">*</span>
              </label>
              <TextInput
                id="pricePerMinute"
                type="number"
                step="0.01"
                min="0.01"
                {...register('pricePerMinute', { valueAsNumber: true })}
                placeholder={form.pricePerMinutePlaceholder}
                error={errors.pricePerMinute?.message}
              />
              <p className="text-[10px] text-gray-500 mt-1">~ {estimatedPerHour} {form.estimatedPerHour}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-5 border-t border-border-subtle flex items-center justify-between">
            <span className="text-[11px] text-gray-500">{form.mandatoryHint}</span>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                {form.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                icon={!isPending ? <Icon name="check" className="w-4 h-4" /> : undefined}
              >
                {isPending ? form.processing : isEditing ? form.submitEdit : form.submit}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
