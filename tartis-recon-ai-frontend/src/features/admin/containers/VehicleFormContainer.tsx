import { useNavigate } from '@tanstack/react-router'
import { useCreateVehicle } from '../hooks/useCreateVehicle'
import { VehicleForm } from '../components/VehicleForm'
import type { VehicleFormData } from '../validation/vehicleSchema'

export function VehicleFormContainer() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateVehicle()

  const handleSubmit = (data: VehicleFormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate({ to: '/admin/vehicles' })
      },
    })
  }

  const handleClose = () => {
    navigate({ to: '/admin/vehicles' })
  }

  return (
    <VehicleForm 
      onSubmit={handleSubmit} 
      onClose={handleClose} 
      isPending={isPending} 
    />
  )
}
