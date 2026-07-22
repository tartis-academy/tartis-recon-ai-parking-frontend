import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tariffSchema, type TariffFormData } from '../validation/tariffSchema'
import { useCreateTariff } from '../hooks/useCreateTariff'

interface TariffFormProps {
  onClose: () => void
  onSuccess?: () => void
}

export function TariffForm({ onClose, onSuccess }: TariffFormProps) {
  const { mutate, isPending } = useCreateTariff()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema),
    defaultValues: {
      name: '',
      vehicleType: 'CAR',
      pricePerMinute: 0.05,
      description: '',
      active: true,
    },
  })

  const pricePerMinute = useWatch({ control, name: 'pricePerMinute' })
  const estimatedPerHour =
    typeof pricePerMinute === 'number' && !isNaN(pricePerMinute)
      ? (pricePerMinute * 60).toFixed(2)
      : '0.00'

  const onSubmit = (data: TariffFormData) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.()
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e14]/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#161b22] border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-[#161b22]">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Crear nueva tarifa</h2>
            <p className="text-xs text-gray-400">
              Define los precios por minuto y condiciones según el tipo de vehículo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          {/* Nombre de la Tarifa */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Nombre de la tarifa <span className="text-emerald-500">*</span>
            </label>
            <input
              id="name"
              {...register('name')}
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Ej. Tarifa Coche Estándar"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Vehículo */}
            <div>
              <label htmlFor="vehicleType" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Tipo de Vehículo <span className="text-emerald-500">*</span>
              </label>
              <select
                id="vehicleType"
                {...register('vehicleType')}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="CAR">Coche (Estándar)</option>
                <option value="CAR_PMR">Coche (PMR)</option>
                <option value="MOTORBIKE">Moto</option>
              </select>
              {errors.vehicleType && <p className="mt-1 text-xs text-red-500">{errors.vehicleType.message}</p>}
            </div>

            {/* Precio por Minuto */}
            <div>
              <label htmlFor="pricePerMinute" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Precio por minuto (€/min) <span className="text-emerald-500">*</span>
              </label>
              <input
                id="pricePerMinute"
                type="number"
                step="0.01"
                min="0.01"
                {...register('pricePerMinute', { valueAsNumber: true })}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="0.05"
              />
              {errors.pricePerMinute && <p className="mt-1 text-xs text-red-500">{errors.pricePerMinute.message}</p>}
              <p className="text-[10px] text-gray-500 mt-1">~ {estimatedPerHour} € / hora</p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              rows={2}
              {...register('description')}
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              placeholder="Detalles u observaciones sobre la tarifa..."
            />
          </div>

          {/* Estado Activo */}
          <div className="flex items-center gap-3">
            <input
              id="active"
              type="checkbox"
              {...register('active')}
              className="w-4 h-4 rounded border-gray-700 bg-[#0b0e14] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="active" className="text-sm text-gray-300 cursor-pointer">
              Activar tarifa inmediatamente
            </label>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-5 border-t border-gray-800 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">
              Los campos marcados con <span className="text-emerald-500">*</span> son obligatorios.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  'Guardando...'
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Crear tarifa
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
