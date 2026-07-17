/*import { useVehicles } from "../hooks/useVehicles";

export default function VehicleTable() {
  const { vehicles, loading, error } = useVehicles();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los vehículos.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Color</th>
          <th>Detalles</th>
          
        </tr>
      </thead>

      <tbody>
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td>{vehicle.plate}</td>
            <td>{vehicle.type}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.color}</td>
            <td>
                {vehicle.type === "COCHE"
                ? `${vehicle.doors} puertas`
                : vehicle.sidecar
                ? "Con sidecar"
                : "Sin sidecar"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}*/

import { useVehicles } from '../hooks/useVehicles'

export default function VehicleTable() {
  const { data: vehicles, isLoading, error } = useVehicles()

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error al cargar los vehículos.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Color</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        {vehicles?.map((vehicle) => (
          <tr key={vehicle.id}>
            <td>{vehicle.plate}</td>
            <td>{vehicle.type}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.color}</td>
            <td>
              {vehicle.type === 'COCHE'
                ? `${vehicle.doors} puertas`
                : vehicle.sidecar
                  ? 'Con sidecar'
                  : 'Sin sidecar'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
