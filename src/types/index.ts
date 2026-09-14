// src/types/index.ts
export type Role = 'CLIENT' | 'PROVIDER';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  providerId: string;
}

export interface Booking {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
  slot: Slot;
  createdAt: string;
}