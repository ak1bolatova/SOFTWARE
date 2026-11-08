import type { Booking, Room } from './types';

export const sampleRooms: Room[] = [
  {
    id: 'r1',
    name: 'A-101',
    building: 'Engineering Block',
    capacity: 40,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
  },
  {
    id: 'r2',
    name: 'B-204',
    building: 'Science Block',
    capacity: 25,
    equipment: ['Projector', 'Video conferencing'],
    blocked: false,
  },
  {
    id: 'r3',
    name: 'C-310',
    building: 'Library Wing',
    capacity: 60,
    equipment: ['Projector', 'Video conferencing', 'Whiteboard'],
    blocked: true,
  },
  {
    id: 'r4',
    name: 'D-105',
    building: 'Arts Center',
    capacity: 15,
    equipment: ['Whiteboard'],
    blocked: false,
  },
  {
    id: 'r5',
    name: 'E-220',
    building: 'Business Block',
    capacity: 30,
    equipment: ['Projector', 'Smart board'],
    blocked: false,
  },
];

export const sampleBookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 480, end: 570, owner: 'Dr. Sharma' },
  { id: 'b2', roomId: 'r1', start: 720, end: 840, owner: 'Prof. Iyer' },
  { id: 'b3', roomId: 'r2', start: 540, end: 660, owner: 'Dr. Rao' },
  { id: 'b4', roomId: 'r2', start: 900, end: 1020, owner: 'CS Dept' },
  { id: 'b5', roomId: 'r4', start: 0, end: 60, owner: 'Arts Club' },
  { id: 'b6', roomId: 'r4', start: 630, end: 750, owner: 'Ms. Nair' },
  { id: 'b7', roomId: 'r5', start: 600, end: 720, owner: 'MBA Batch' },
  { id: 'b8', roomId: 'r5', start: 840, end: 960, owner: 'Finance Sem' },
];
