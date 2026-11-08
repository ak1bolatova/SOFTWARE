interface RoomFiltersProps {
  attendeesStr: string;
  attendeesValid: boolean;
  onAttendeesChange: (value: string) => void;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onToggleEquipment: (item: string) => void;
}

export function RoomFilters({
  attendeesStr,
  attendeesValid,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <label htmlFor="attendees" className="block text-xs font-medium text-gray-600 mb-1">
          Attendees
        </label>
        <input
          id="attendees"
          type="number"
          min={1}
          value={attendeesStr}
          onChange={(e) => onAttendeesChange(e.target.value)}
          placeholder="Any"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
        />
        {!attendeesValid && (
          <p className="mt-1 text-xs text-red-600">Enter a whole number of 1 or more.</p>
        )}
      </div>

      <fieldset>
        <legend className="block text-xs font-medium text-gray-600 mb-2">Required equipment</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {equipmentOptions.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedEquipment.includes(item)}
                onChange={() => onToggleEquipment(item)}
                className="h-4 w-4 rounded border-gray-300 accent-sky-600"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
