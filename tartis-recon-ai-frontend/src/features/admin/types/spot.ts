import type { VehicleType } from './vehicle'

export type SpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE'

export interface Spot {
  id: string;
  type: VehicleType;
  status: SpotStatus;
}

export interface SpotAvailability {
  type: VehicleType;
  available: boolean;
  availableCount: number;
  totalCount: number;
}
