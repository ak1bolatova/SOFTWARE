import { CalendarCheck, Clock, DoorOpen, Timer } from 'lucide-react';
import { RoomFilters } from '@/components/RoomFilters';
import { RoomList } from '@/components/RoomList';
import { Timeline } from '@/components/Timeline';
import { ResultPanel } from '@/components/ResultPanel';
import { BookingsList } from '@/components/BookingsList';
import { formatDuration, formatTime } from '@/lib/availability';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';
import { MAX_DURATION, MAX_TIME } from '@/lib/types';

function App() {
  const {
    currentTime,
    startStr,
    endStr,
    startNum,
    endNum,
    startValid,
    endValid,
    duration,
    attendeesStr,
    attendeesValid,
    selectedEquipment,
    equipmentOptions,
    filteredRooms,
    selectedRoom,
    roomBookings,
    result,
    handleCheck,
    reset,
    handleStartChange,
    handleEndChange,
    handleAttendeesChange,
    toggleEquipment,
    handleSelectRoom,
  } = useAvailabilityCheck();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold leading-tight">
              Smart Campus Room Availability
            </h1>
            <p className="text-xs text-gray-500">
              Fictional sample data · single-page prototype
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-orange-700">
            <Clock className="h-3.5 w-3.5" />
            Current time: {formatTime(currentTime)}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: rooms */}
        <section className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <DoorOpen className="h-4 w-4 text-sky-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Rooms
            </h2>
          </div>
          <RoomFilters
            attendeesStr={attendeesStr}
            attendeesValid={attendeesValid}
            onAttendeesChange={handleAttendeesChange}
            equipmentOptions={equipmentOptions}
            selectedEquipment={selectedEquipment}
            onToggleEquipment={toggleEquipment}
          />
          <RoomList
            rooms={filteredRooms}
            selectedRoomId={selectedRoom?.id ?? null}
            onSelect={handleSelectRoom}
          />
        </section>

        {/* Right column: form + timeline + result */}
        <section className="lg:col-span-2 space-y-6">
          {/* Booking form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4">Check an interval</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start (min)
                </label>
                <input
                  type="number"
                  min={0}
                  max={MAX_TIME}
                  value={startStr}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="0–1440"
                />
                {!startValid && (
                  <p className="mt-1 text-xs text-red-600">
                    Enter a value between 0 and {MAX_TIME}.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End (min)
                </label>
                <input
                  type="number"
                  min={0}
                  max={MAX_TIME}
                  value={endStr}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  placeholder="1–1440"
                />
                {!endValid && (
                  <p className="mt-1 text-xs text-red-600">
                    Enter a value between 0 and {MAX_TIME}.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Duration
                </label>
                <div className="flex h-[38px] items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 text-sm text-gray-700">
                  <Timer className="h-3.5 w-3.5 text-gray-400" />
                  {duration > 0 ? formatDuration(duration) : '—'}
                </div>
                {duration > MAX_DURATION && (
                  <p className="mt-1 text-xs text-red-600">Exceeds {MAX_DURATION} min limit.</p>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Times are in minutes from 00:00 (0 ≤ start &lt; end ≤ {MAX_TIME}). The
            start must be after the current time ({formatTime(currentTime)}). Touching
            endpoints are allowed.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCheck}
                disabled={!selectedRoom || !startValid || !endValid}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <CalendarCheck className="h-4 w-4" />
                Check availability
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">
                {selectedRoom ? `Timeline — ${selectedRoom.name}` : 'Timeline'}
              </h2>
              <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-sky-200 border border-sky-300" />
                  Booked
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-400/50 border border-emerald-500 border-dashed" />
                  Candidate
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-0.5 bg-orange-400" />
                  Now
                </span>
              </div>
            </div>
            <Timeline
              bookings={roomBookings}
              candidateStart={startValid ? startNum : null}
              candidateEnd={endValid && endNum > startNum ? endNum : null}
              currentTime={currentTime}
            />
            {roomBookings.length > 0 && <BookingsList bookings={roomBookings} />}
          </div>

          {/* Result */}
          <ResultPanel result={result} />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-gray-400">
        Prototype · Fictional sample data · No data is saved or changed.
      </footer>
    </div>
  );
}

export default App;
