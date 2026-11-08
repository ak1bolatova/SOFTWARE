import { SearchX } from 'lucide-react';
import type { Room } from '@/lib/types';
import { RoomCard } from '@/components/RoomCard';

interface RoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export function RoomList({ rooms, selectedRoomId, onSelect }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <SearchX className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">No rooms match these filters.</p>
        <p className="mt-1 text-xs text-gray-500">
          Try fewer attendees or fewer equipment items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          selected={room.id === selectedRoomId}
          onSelect={() => onSelect(room.id)}
        />
      ))}
    </div>
  );
}
