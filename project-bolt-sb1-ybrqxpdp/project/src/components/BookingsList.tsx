import { formatTime } from '@/lib/availability';
import type { Booking } from '@/lib/types';

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Existing bookings
      </p>
      <ul className="space-y-1.5">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-gray-800">
              {formatTime(b.start)} – {formatTime(b.end)}
            </span>
            <span className="text-xs text-gray-500">{b.owner}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
