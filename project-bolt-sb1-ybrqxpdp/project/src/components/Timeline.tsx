import { formatTime } from '@/lib/availability';
import type { Booking } from '@/lib/types';
import { MAX_TIME } from '@/lib/types';

interface TimelineProps {
  bookings: Booking[];
  candidateStart: number | null;
  candidateEnd: number | null;
  currentTime: number;
}

export function Timeline({ bookings, candidateStart, candidateEnd, currentTime }: TimelineProps) {
  const ticks: number[] = [];
  for (let t = 0; t <= MAX_TIME; t += 120) {
    ticks.push(t);
  }

  const hasCandidate = candidateStart !== null && candidateEnd !== null;

  return (
    <div className="select-none">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>00:00</span>
        <span className="font-medium text-gray-400">Daily Timeline</span>
        <span>24:00</span>
      </div>

      <div className="relative h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
        {bookings.map((b) => {
          const left = (b.start / MAX_TIME) * 100;
          const width = ((b.end - b.start) / MAX_TIME) * 100;
          return (
            <div
              key={b.id}
              className="absolute top-0 bottom-0 bg-sky-200/80 border-x border-sky-300 flex items-center justify-center overflow-hidden"
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${formatTime(b.start)}–${formatTime(b.end)} · ${b.owner}`}
            >
              <span className="text-[10px] font-medium text-sky-800 whitespace-nowrap px-1">
                {formatTime(b.start)}–{formatTime(b.end)}
              </span>
            </div>
          );
        })}

        {hasCandidate && (
          <div
            className="absolute top-0 bottom-0 bg-emerald-400/40 border-x-2 border-emerald-500 border-dashed flex items-center justify-center"
            style={{
              left: `${(candidateStart! / MAX_TIME) * 100}%`,
              width: `${((candidateEnd! - candidateStart!) / MAX_TIME) * 100}%`,
            }}
          >
            <span className="text-[10px] font-semibold text-emerald-700 whitespace-nowrap px-1">
              candidate
            </span>
          </div>
        )}

        <div
          className="absolute top-0 bottom-0 w-px bg-orange-400"
          style={{ left: `${(currentTime / MAX_TIME) * 100}%` }}
          title={`Now: ${formatTime(currentTime)}`}
        >
          <div className="absolute -top-0 -translate-x-1/2 left-0 text-[9px] text-orange-600 font-bold whitespace-nowrap">
            NOW
          </div>
        </div>
      </div>

      <div className="mt-1.5 relative h-4">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2 text-[10px] text-gray-400"
            style={{ left: `${(t / MAX_TIME) * 100}%` }}
          >
            {formatTime(t)}
          </span>
        ))}
      </div>
    </div>
  );
}
