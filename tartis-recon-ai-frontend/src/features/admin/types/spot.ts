export type VehicleType = 'CAR' | 'CAR_PMR' | 'MOTORBIKE';
export type SpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';

export interface Spot {
  id: string;
  type: VehicleType;
  status: SpotStatus;
}
