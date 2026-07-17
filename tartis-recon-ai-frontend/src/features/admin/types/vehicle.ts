export interface VehicleBase {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
}

export interface Car extends VehicleBase {
  type: 'COCHE';
  doors: number;
}

export interface Motorcycle extends VehicleBase {
  type: 'MOTO';
  sidecar: boolean;
}

export type Vehicle = Car | Motorcycle;

export type VehicleType = 'COCHE' | 'MOTO';