import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { filterRooms, getEquipmentOptions } from './filterRooms';
import type { Room } from './types';

const rooms: Room[] = [
  { id: 'a', name: 'A', building: 'X', capacity: 40, equipment: ['Projector', 'Whiteboard'], blocked: false },
  { id: 'b', name: 'B', building: 'X', capacity: 25, equipment: ['Projector'], blocked: false },
  {
    id: 'c',
    name: 'C',
    building: 'X',
    capacity: 60,
    equipment: ['Projector', 'Whiteboard', 'Video conferencing'],
    blocked: true,
  },
];

const ids = (list: Room[]) => list.map((r) => r.id);

describe('filterRooms', () => {
  it('keeps a room whose capacity exactly matches the attendees', () => {
    expect(ids(filterRooms(rooms, { attendees: 40, equipment: [] }))).toEqual(['a', 'c']);
  });

  it('drops rooms smaller than the attendees', () => {
    expect(ids(filterRooms(rooms, { attendees: 41, equipment: [] }))).toEqual(['c']);
  });

  it('applies no capacity filter when attendees is null', () => {
    expect(ids(filterRooms(rooms, { attendees: null, equipment: [] }))).toEqual(['a', 'b', 'c']);
  });

  it('keeps rooms that have one selected equipment item', () => {
    expect(ids(filterRooms(rooms, { attendees: null, equipment: ['Projector'] }))).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(ids(filterRooms(rooms, { attendees: null, equipment: ['Video conferencing'] }))).toEqual(['c']);
  });

  it('requires every selected equipment item', () => {
    expect(
      ids(filterRooms(rooms, { attendees: null, equipment: ['Projector', 'Whiteboard'] })),
    ).toEqual(['a', 'c']);
  });

  it('returns no rooms when nothing matches', () => {
    expect(filterRooms(rooms, { attendees: 61, equipment: [] })).toEqual([]);
    expect(
      filterRooms(rooms, { attendees: null, equipment: ['Video conferencing', 'Smart board'] }),
    ).toEqual([]);
  });

  it('keeps blocked rooms in the list so they can be shown as unavailable', () => {
    expect(ids(filterRooms(rooms, { attendees: 60, equipment: [] }))).toEqual(['c']);
    expect(rooms.find((r) => r.id === 'c')?.blocked).toBe(true);
  });

  it('F3: a blocked room returned by filterRooms is never reported available', () => {
    const [blocked] = filterRooms(rooms, { attendees: 60, equipment: [] });
    const r = checkAvailability({
      room: blocked,
      start: 700,
      end: 760,
      currentTime: 420,
      bookings: [],
    });
    expect(r.status).toBe('unavailable');
  });

  it('does not mutate the input rooms array', () => {
    const copy = rooms.map((r) => ({ ...r, equipment: [...r.equipment] }));
    filterRooms(rooms, { attendees: 30, equipment: ['Projector'] });
    expect(rooms).toEqual(copy);
  });
});

describe('getEquipmentOptions', () => {
  it('returns each equipment item once, sorted', () => {
    expect(getEquipmentOptions(rooms)).toEqual(['Projector', 'Video conferencing', 'Whiteboard']);
  });
});
