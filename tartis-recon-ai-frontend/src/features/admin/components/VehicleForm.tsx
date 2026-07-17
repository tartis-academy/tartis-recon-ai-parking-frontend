import { useForm } from 'react-hook-form'
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
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'CAR',
      numDoors: 4,
      hasSideCar: false,
    },
  })

  const vehicleType = watch('type')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Crear Vehículo</h1>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            aria-label="Cerrar formulario"
          >
            ✕ Cerrar
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="plate" className="block text-sm font-semibold text-gray-700 mb-2">Matrícula</label>
              <input
                id="plate"
                {...register('plate')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="1234ABC"
              />
              {errors.plate && <p className="mt-1 text-sm text-red-600">{errors.plate.message}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <select
                id="type"
                {...register('type')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="CAR">Coche</option>
                <option value="CAR_PMR">Coche PMR</option>
                <option value="MOTORBIKE">Moto</option>
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
              <input
                id="brand"
                {...register('brand')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Toyota"
              />
              {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
              <input
                id="model"
                {...register('model')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Corolla"
              />
              {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input
                id="color"
                {...register('color')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Blanco"
              />
              {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
            </div>

            {isCar ? (
              <div>
                <label htmlFor="numDoors" className="block text-sm font-semibold text-gray-700 mb-2">Número de puertas</label>
                <input
                  id="numDoors"
                  type="number"
                  {...register('numDoors', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  min="2"
                  max="5"
                />
                {errors.numDoors && <p className="mt-1 text-sm text-red-600">{errors.numDoors.message}</p>}
              </div>
            ) : (
              <div className="flex items-center">
                <label htmlFor="hasSideCar" className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="hasSideCar"
                    type="checkbox"
                    {...register('hasSideCar')}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Tiene sidecar</span>
                </label>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
            >
              {isPending ? 'Creando...' : 'Crear vehículo'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
