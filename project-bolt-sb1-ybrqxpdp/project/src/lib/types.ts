export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number;
  end: number;
  owner: string;
}

export type AvailabilityResult =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export interface DecisionInput {
  room: Room;
  start: number;
  end: number;
  currentTime: number;
  bookings: Booking[];
}

export const MAX_TIME = 1440;
export const MAX_DURATION = 120;
