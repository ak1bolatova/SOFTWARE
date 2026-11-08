import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';

const room = {
  id: 'r1',
  name: 'Room 101',
  building: 'Main',
  capacity: 8,
  equipment: ['Projector'],
  blocked: false,
};
const blockedRoom = { ...room, id: 'r2', name: 'Room 102', blocked: true };
const existing = { id: 'b1', roomId: 'r1', start: 540, end: 600, owner: 'Alex' }; // 09:00-10:00

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

describe('checkAvailability', () => {
  it('T1: booking starting exactly when another ends is available', () => {
    const r = checkAvailability({ room, start: 600, end: 660, currentTime: 420, bookings: [existing] });
    expect(r.status).toBe('available');
  });

  it('T2: booking ending exactly when another starts is available', () => {
    const r = checkAvailability({ room, start: 480, end: 540, currentTime: 420, bookings: [existing] });
    expect(r.status).toBe('available');
  });

  it('T3: real overlap is unavailable', () => {
    const r = checkAvailability({ room, start: 570, end: 630, currentTime: 420, bookings: [existing] });
    expect(r.status).toBe('unavailable');
  });

  it('T4: does not mutate bookings array', () => {
    const bookings = [
      { id: 'b2', roomId: 'r1', start: 840, end: 900, owner: 'Sam' },
      { id: 'b1', roomId: 'r1', start: 540, end: 600, owner: 'Alex' },
    ];
    const copy = JSON.parse(JSON.stringify(bookings));
    checkAvailability({ room, start: 700, end: 760, currentTime: 420, bookings });
    expect(bookings).toEqual(copy);
  });

  it('AC1: rejects a start time in the past', () => {
    const r = checkAvailability({ room, start: 300, end: 360, currentTime: 540, bookings: [] });
    expect(r.status).toBe('unavailable');
    if (r.status === 'unavailable') {
      expect(r.reasons.some((x) => x.toLowerCase().includes('current time'))).toBe(true);
    }
  });

  it('AC1: rejects a reversed interval (start >= end)', () => {
    const r = checkAvailability({ room, start: 700, end: 700, currentTime: 420, bookings: [] });
    expect(r.status).toBe('unavailable');
  });

  it('AC2: allows a booking of exactly 120 minutes', () => {
    const r = checkAvailability({ room, start: 700, end: 820, currentTime: 420, bookings: [] });
    expect(r.status).toBe('available');
  });

  it('AC2: rejects a booking of 121 minutes', () => {
    const r = checkAvailability({ room, start: 700, end: 821, currentTime: 420, bookings: [] });
    expect(r.status).toBe('unavailable');
    if (r.status === 'unavailable') {
      expect(r.reasons.some((x) => x.toLowerCase().includes('120'))).toBe(true);
    }
  });

  it('AC3: a blocked room is never available', () => {
    const r = checkAvailability({
      room: blockedRoom,
      start: 700,
      end: 760,
      currentTime: 420,
      bookings: [],
    });
    expect(r.status).toBe('unavailable');
    if (r.status === 'unavailable') {
      expect(r.reasons.some((x) => x.toLowerCase().includes('blocked'))).toBe(true);
    }
  });

  it('AC4: rejects an overlapping booking', () => {
    const r = checkAvailability({ room, start: 550, end: 610, currentTime: 420, bookings: [existing] });
    expect(r.status).toBe('unavailable');
    if (r.status === 'unavailable') {
      expect(r.reasons.some((x) => x.toLowerCase().includes('overlap'))).toBe(true);
    }
  });

  it('AC4: allows bookings touching only at endpoints', () => {
    const a = checkAvailability({ room, start: 600, end: 660, currentTime: 420, bookings: [existing] });
    const b = checkAvailability({ room, start: 480, end: 540, currentTime: 420, bookings: [existing] });
    expect(a.status).toBe('available');
    expect(b.status).toBe('available');
  });

  it('AC5: does not mutate fixture-style booking data', () => {
    const bookings = [{ id: 'b1', roomId: 'r1', start: 540, end: 600, owner: 'Alex' }];
    const copy = JSON.parse(JSON.stringify(bookings));
    checkAvailability({ room, start: 700, end: 760, currentTime: 420, bookings });
    expect(bookings).toEqual(copy);
    expect(bookings[0]).toEqual(copy[0]);
  });

  it('AC1: rejects a start time equal to the current time', () => {
    const r = checkAvailability({ room, start: 540, end: 600, currentTime: 540, bookings: [] });
    expect(r.status).toBe('unavailable');
  });

  it('AC1: rejects a negative start time', () => {
    const r = checkAvailability({ room, start: -30, end: 60, currentTime: 420, bookings: [] });
    expect(r.status).toBe('unavailable');
  });

  it('AC1: rejects an end time after 1440 (end of day)', () => {
    const r = checkAvailability({ room, start: 1400, end: 1441, currentTime: 420, bookings: [] });
    expect(r.status).toBe('unavailable');
  });

  it('every unavailable result carries at least one reason', () => {
    const cases = [
      { room, start: 700, end: 700, bookings: [] },
      { room, start: -5, end: 60, bookings: [] },
      { room, start: 300, end: 360, bookings: [] },
      { room, start: 1400, end: 1441, bookings: [] },
      { room, start: 700, end: 821, bookings: [] },
      { room, start: 570, end: 630, bookings: [existing] },
      { room: blockedRoom, start: 700, end: 760, bookings: [] },
    ];
    for (const c of cases) {
      const r = checkAvailability({ ...c, currentTime: 420 });
      expect(r.status).toBe('unavailable');
      expect(r.status === 'unavailable' && r.reasons.length > 0).toBe(true);
    }
  });

  it('AC5: runs on deep-frozen rooms and bookings without throwing or mutating', () => {
    const frozenRoom = deepFreeze({ ...room, equipment: ['Projector'] });
    const frozenBookings = deepFreeze([{ ...existing }]);
    const copy = JSON.parse(JSON.stringify(frozenBookings));
    const run = () =>
      checkAvailability({
        room: frozenRoom,
        start: 700,
        end: 760,
        currentTime: 420,
        bookings: frozenBookings,
      });
    expect(run).not.toThrow();
    expect(run().status).toBe('available');
    expect(frozenBookings).toEqual(copy);
  });

  it('uses only the selected room bookings (ignores other rooms)', () => {
    const otherRoomBooking = { id: 'bx', roomId: 'r9', start: 700, end: 760, owner: 'Other' };
    const r = checkAvailability({
      room,
      start: 700,
      end: 760,
      currentTime: 420,
      bookings: [otherRoomBooking],
    });
    expect(r.status).toBe('available');
  });
});
