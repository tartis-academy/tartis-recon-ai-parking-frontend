import { useNavigate } from '@tanstack/react-router'
import VehicleForm from '../components/VehicleForm'

export default function VehicleCreatePage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: '/admin/vehicles' })
  }

  return <VehicleForm onSuccess={handleSuccess} />
}
