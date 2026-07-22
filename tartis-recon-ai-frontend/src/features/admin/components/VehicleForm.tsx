import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleSchema, type VehicleFormData } from '../validation/vehicleSchema'
import { adminLabels } from '../labels'

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
      hasSideCar: false,
    },
  })

  const vehicleType = useWatch({ control, name: 'type' })
  const isCar = vehicleType === 'CAR' || vehicleType === 'CAR_PMR'

  return (
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
            className="text-gray-500 hover:text-white bg-surface-panel hover:bg-surface-row-hover p-1.5 rounded-md transition-colors border border-border-default"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              <input
                id="plate"
                {...register('plate')}
                className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors uppercase"
                placeholder={form.placeholder.plate}
              />
              {errors.plate && <p className="mt-1 text-xs text-state-error">{errors.plate.message}</p>}
              <p className="text-[10px] text-gray-500 mt-1">{form.plateHint}</p>
            </div>

            <div>
              <label htmlFor="type" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.type} <span className="text-brand-500">*</span></label>
              <select
                id="type"
                {...register('type')}
                className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none"
              >
                <option value="CAR">{adminLabels.vehicles.types.car} (Estándar)</option>
                <option value="CAR_PMR">{adminLabels.vehicles.types.carPmr}</option>
                <option value="MOTORBIKE">{adminLabels.vehicles.types.motorbike}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.brand} <span className="text-brand-500">*</span></label>
              <input
                id="brand"
                {...register('brand')}
                className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                placeholder={form.placeholder.brand}
              />
              {errors.brand && <p className="mt-1 text-xs text-state-error">{errors.brand.message}</p>}
            </div>

            <div>
              <label htmlFor="model" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.model} <span className="text-brand-500">*</span></label>
              <input
                id="model"
                {...register('model')}
                className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                placeholder={form.placeholder.model}
              />
              {errors.model && <p className="mt-1 text-xs text-state-error">{errors.model.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.color}</label>
            <input
              id="color"
              {...register('color')}
              className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
              placeholder={form.placeholder.color}
            />
          </div>

          {isCar ? (
            <div>
              <label htmlFor="numDoors" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{form.doors}</label>
              <input
                id="numDoors"
                type="number"
                {...register('numDoors', { valueAsNumber: true })}
                className="w-full bg-surface-app border border-border-default rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                min="2"
                max="5"
              />
            </div>
          ) : (
            <div>
              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  {...register('hasSideCar')}
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
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-surface-panel hover:bg-surface-row-hover transition-colors border border-border-default"
              >
                {form.cancel}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-black bg-brand-500 hover:bg-brand-400 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPending ? form.processing : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {form.submit}
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
