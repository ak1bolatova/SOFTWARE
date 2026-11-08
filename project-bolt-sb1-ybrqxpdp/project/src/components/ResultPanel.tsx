import { CheckCircle2, XCircle, Info } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/types';

interface ResultPanelProps {
  result: AvailabilityResult | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
        <Info className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Select a room and enter start/end times to check availability.
        </p>
      </div>
    );
  }

  if (result.status === 'available') {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Available</h3>
            <p className="text-sm text-emerald-700">
              This room can be booked for the selected interval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-6 animate-in fade-in duration-300">
      <div className="flex items-start gap-3">
        <XCircle className="h-9 w-9 text-red-600 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-red-800">Unavailable</h3>
          <ul className="mt-1.5 space-y-1">
            {result.reasons.map((r, i) => (
              <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 rounded-full bg-red-500 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
