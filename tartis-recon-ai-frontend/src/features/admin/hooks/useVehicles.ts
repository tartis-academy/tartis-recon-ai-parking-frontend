import { useEffect, useState } from "react";
import { getVehicles } from "../api/vehicles";
import type { Vehicle } from "../types/vehicle";


export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Solicitando vehículos...");

    getVehicles()
      .then((data) => {
        //console.log("Respuesta completa:", data);
        //console.log("Tipo:", typeof data);
        //console.log("Es array:", Array.isArray(data));
        setVehicles(data);
      })
      .catch((err) => {
        console.error("Error al obtener vehículos:", err);
        setError(err);
      })
      .finally(() => {
        console.log("Petición finalizada");
        setLoading(false);
      });
  }, []);

  return {
    vehicles,
    loading,
    error,
  };
}