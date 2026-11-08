import { Lock, Users, MapPin } from 'lucide-react';
import type { Room } from '@/lib/types';

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={room.blocked}
      className={[
        'w-full text-left rounded-xl border p-4 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-sky-400',
        room.blocked
          ? 'border-red-200 bg-red-50 cursor-not-allowed opacity-75'
          : selected
            ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-400 shadow-sm'
            : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm',
      ].join(' ')}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">{room.name}</span>
            {room.blocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                <Lock className="h-3 w-3" />
                Blocked
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {room.building}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.capacity} seats
            </span>
          </div>
        </div>
        {!room.blocked && (
          <div
            className={[
              'mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-colors',
              selected ? 'border-sky-500 bg-sky-500' : 'border-gray-300',
            ].join(' ')}
          />
        )}
      </div>
    </button>
  );
}
