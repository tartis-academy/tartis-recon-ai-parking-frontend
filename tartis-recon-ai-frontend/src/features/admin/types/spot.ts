import type { VehicleType } from './vehicle'

export type SpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE'

export interface Spot {
  id: string;
  type: VehicleType;
  status: SpotStatus;
}
