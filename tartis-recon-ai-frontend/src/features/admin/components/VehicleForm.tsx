import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPortal } from 'react-dom'
import { vehicleSchema, type VehicleFormData } from '../validation/vehicleSchema'
import { adminLabels } from '../labels'
import { TextInput, Select, Button, Icon } from '@/shared/ui'

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void
  onClose: () => void
  isPending: boolean
}

export function VehicleForm({ onSubmit, onClose, isPending }: VehicleFormProps) {
  const { form } = adminLabels

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'CAR',
      numDoors: 4,
      hasSidecar: false,
    },
  })

  const vehicleType = useWatch({ control, name: 'type' })
  const isCar = vehicleType === 'CAR' || vehicleType === 'CAR_PMR'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-app/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-card border border-border-subtle rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex justify-between items-start bg-surface-card">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{form.title}</h2>
            <p className="text-xs text-gray-400">{form.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white bg-surface-panel hover:bg-surface-row-hover p-1.5 rounded-md transition-colors border border-border-default flex-shrink-0"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.idAssigned}</label>
            <div className="w-full px-4 py-2.5 bg-brand-soft border border-brand-500/30 rounded-lg text-brand-400 font-medium">
              VHC-Auto
            </div>
            <p className="text-[10px] text-gray-500 mt-1">{form.idAssignedHint}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plate" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.plate} <span className="text-brand-500">*</span></label>
              <TextInput
                id="plate"
                {...register('plate')}
                className="uppercase"
                placeholder={form.placeholder.plate}
                error={errors.plate?.message}
              />
              <p className="text-[10px] text-gray-500 mt-1">{form.plateHint}</p>
            </div>

            <div>
              <label htmlFor="type" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.type} <span className="text-brand-500">*</span></label>
              <Select
                id="type"
                {...register('type')}
                error={errors.type?.message}
              >
                <option value="CAR">{adminLabels.vehicles.types.car} (Estándar)</option>
                <option value="CAR_PMR">{adminLabels.vehicles.types.carPmr}</option>
                <option value="MOTORBIKE">{adminLabels.vehicles.types.motorbike}</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.brand} <span className="text-brand-500">*</span></label>
              <TextInput
                id="brand"
                {...register('brand')}
                placeholder={form.placeholder.brand}
                error={errors.brand?.message}
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.model} <span className="text-brand-500">*</span></label>
              <TextInput
                id="model"
                {...register('model')}
                placeholder={form.placeholder.model}
                error={errors.model?.message}
              />
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.color}</label>
            <TextInput
              id="color"
              {...register('color')}
              placeholder={form.placeholder.color}
              error={errors.color?.message}
            />
          </div>

          {isCar ? (
            <div>
              <label htmlFor="numDoors" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.doors}</label>
              <TextInput
                id="numDoors"
                type="number"
                {...register('numDoors', { valueAsNumber: true })}
                min="2"
                max="5"
                error={errors.numDoors?.message}
              />
            </div>
          ) : (
            <div>
              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  {...register('hasSidecar')}
                  className="w-4 h-4 rounded border-border-default bg-surface-app text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-app"
                />
                <span className="text-sm text-gray-300">{form.hasSideCar}</span>
              </label>
            </div>
          )}
          
          {/* Footer Actions */}
          <div className="mt-4 pt-5 border-t border-border-subtle flex items-center justify-between">
            <span className="text-[11px] text-gray-500">{form.mandatoryHint}</span>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                {form.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                icon={!isPending ? <Icon name="check" className="w-4 h-4" /> : undefined}
              >
                {isPending ? form.processing : form.submit}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>,
    document.body,
  )
}
