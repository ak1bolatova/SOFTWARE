import {
  MAX_DURATION,
  MAX_TIME,
  type AvailabilityResult,
  type Booking,
  type DecisionInput,
} from './types';

export function overlapsExisting(start: number, end: number, booking: Booking): boolean {
  return start < booking.end && end > booking.start;
}

/**
 * Pure booking-rule checks. Each function corresponds to one acceptance
 * criterion and returns a reason string when the rule is violated.
 */
function invalidRange(start: number, end: number): string | null {
  if (start < 0 || end < 0) return 'Start and end times must be 0 or greater.';
  if (!(start < end)) return 'Start time must be earlier than end time.';
  if (start >= MAX_TIME || end > MAX_TIME) {
    return `End time cannot exceed ${MAX_TIME} (end of day).`;
  }
  return null;
}

function startInPast(
  start: number,
  end: number,
  currentTime: number,
): string | null {
  if (start >= 0 && end <= MAX_TIME && start < end && start <= currentTime) {
    return 'Start time must be after the current time.';
  }
  return null;
}

function tooLong(start: number, end: number): string | null {
  if (end - start > MAX_DURATION) {
    return `Bookings cannot exceed ${MAX_DURATION} minutes.`;
  }
  return null;
}

function roomBlocked(roomName: string, blocked: boolean): string | null {
  if (blocked) return `Room "${roomName}" is currently blocked and unavailable.`;
  return null;
}

function overlapConflicts(
  start: number,
  end: number,
  roomId: string,
  bookings: Booking[],
): string | null {
  const conflicts = getRoomBookings(bookings, roomId).filter((b) =>
    overlapsExisting(start, end, b),
  );
  if (conflicts.length === 0) return null;
  return conflicts.length === 1
    ? 'The interval overlaps an existing booking.'
    : `The interval overlaps ${conflicts.length} existing bookings.`;
}

export function checkAvailability(input: DecisionInput): AvailabilityResult {
  const { room, start, end, currentTime, bookings } = input;
  const reasons: string[] = [];

  const checks: (string | null)[] = [
    invalidRange(start, end),
    startInPast(start, end, currentTime),
    tooLong(start, end),
    roomBlocked(room.name, room.blocked),
    overlapConflicts(start, end, room.id, bookings),
  ];

  for (const reason of checks) {
    if (reason) reasons.push(reason);
  }

  if (reasons.length > 0) {
    return { status: 'unavailable', reasons };
  }
  return { status: 'available' };
}

export function getRoomBookings(bookings: Booking[], roomId: string): Booking[] {
  return bookings.filter((b) => b.roomId === roomId);
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
