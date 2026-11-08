import type { Room } from './types';

export interface RoomFilters {
  attendees: number | null;
  equipment: string[];
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  const { attendees, equipment } = filters;
  return rooms.filter((room) => {
    if (attendees !== null && room.capacity < attendees) return false;
    return equipment.every((item) => room.equipment.includes(item));
  });
}

export function getEquipmentOptions(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort();
}
