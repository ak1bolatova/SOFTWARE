import { useState } from 'react';
import { checkAvailability, getRoomBookings } from '@/lib/availability';
import { filterRooms, getEquipmentOptions } from '@/lib/filterRooms';
import { sampleBookings, sampleRooms } from '@/lib/sampleData';
import type { AvailabilityResult } from '@/lib/types';
import { MAX_TIME } from '@/lib/types';

export function useAvailabilityCheck() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('r1');
  const [startStr, setStartStr] = useState<string>('600');
  const [endStr, setEndStr] = useState<string>('690');
  const [attendeesStr, setAttendeesStr] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [currentTime] = useState<number>(540);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const attendeesNum = attendeesStr.trim() === '' ? null : Number(attendeesStr);
  const attendeesValid =
    attendeesNum === null || (Number.isInteger(attendeesNum) && attendeesNum >= 1);
  const filteredRooms = filterRooms(sampleRooms, {
    attendees: attendeesValid ? attendeesNum : null,
    equipment: selectedEquipment,
  });
  const equipmentOptions = getEquipmentOptions(sampleRooms);
  const selectedRoom = filteredRooms.find((r) => r.id === selectedRoomId) ?? null;
  const roomBookings = selectedRoom
    ? getRoomBookings(sampleBookings, selectedRoom.id)
    : [];

  const startNum = parseInt(startStr, 10);
  const endNum = parseInt(endStr, 10);
  const startValid = !Number.isNaN(startNum) && startNum >= 0 && startNum <= MAX_TIME;
  const endValid = !Number.isNaN(endNum) && endNum >= 0 && endNum <= MAX_TIME;
  const duration = startValid && endValid ? endNum - startNum : 0;

  const result: AvailabilityResult | null =
    hasChecked && selectedRoom && startValid && endValid
      ? checkAvailability({
          room: selectedRoom,
          start: startNum,
          end: endNum,
          currentTime,
          bookings: roomBookings,
        })
      : null;

  const handleCheck = () => {
    setHasChecked(true);
  };

  const reset = () => {
    setHasChecked(false);
  };

  const handleStartChange = (value: string) => {
    setStartStr(value);
    reset();
  };

  const handleEndChange = (value: string) => {
    setEndStr(value);
    reset();
  };

  const handleAttendeesChange = (value: string) => {
    setAttendeesStr(value);
    reset();
  };

  const toggleEquipment = (item: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
    reset();
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    reset();
  };

  return {
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
  };
}
