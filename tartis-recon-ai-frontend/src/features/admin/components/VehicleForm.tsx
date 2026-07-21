import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { vehicleSchema, type VehicleFormData } from '../validation/vehicleSchema'
import { useCreateVehicle } from '../hooks/useCreateVehicle'

interface VehicleFormProps {
  onSuccess?: () => void
}

export default function VehicleForm({ onSuccess }: VehicleFormProps) {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateVehicle()
  
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

  const onSubmit = (data: VehicleFormData) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  const handleClose = () => {
    navigate({ to: '/admin/vehicles' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e14]/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#161b22] border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-[#161b22]">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Registrar vehículo</h2>
            <p className="text-xs text-gray-400">Alta en el registro · la plaza seleccionada se marcará como ocupada</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ID Asignado</label>
            <div className="w-full px-4 py-2.5 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium">
              VHC-Auto
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Generado automáticamente · secuencial</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plate" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Matrícula <span className="text-emerald-500">*</span></label>
              <input
                id="plate"
                {...register('plate')}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase"
                placeholder="1234 ABC"
              />
              {errors.plate && <p className="mt-1 text-xs text-red-500">{errors.plate.message}</p>}
              <p className="text-[10px] text-gray-500 mt-1">Formato: 4 dígitos + 3 letras</p>
            </div>

            <div>
              <label htmlFor="type" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tipo <span className="text-emerald-500">*</span></label>
              <select
                id="type"
                {...register('type')}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="CAR">Coche (Estándar)</option>
                <option value="CAR_PMR">Coche (PMR)</option>
                <option value="MOTORBIKE">Moto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Marca <span className="text-emerald-500">*</span></label>
              <input
                id="brand"
                {...register('brand')}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Seat"
              />
              {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>}
            </div>

            <div>
              <label htmlFor="model" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Modelo <span className="text-emerald-500">*</span></label>
              <input
                id="model"
                {...register('model')}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="León"
              />
              {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Color</label>
            <input
              id="color"
              {...register('color')}
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Blanco"
            />
          </div>

          {isCar ? (
            <div>
              <label htmlFor="numDoors" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Puertas</label>
              <input
                id="numDoors"
                type="number"
                {...register('numDoors', { valueAsNumber: true })}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
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
                  className="w-4 h-4 rounded border-gray-700 bg-[#0b0e14] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-300">Tiene sidecar</span>
              </label>
            </div>
          )}
          
          {/* Footer Actions */}
          <div className="mt-4 pt-5 border-t border-gray-800 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">Los campos marcados con <span className="text-emerald-500">*</span> son obligatorios.</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Procesando...' : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    Registrar vehículo
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
