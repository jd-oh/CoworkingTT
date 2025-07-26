import React from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'empresa' | 'freelancer';
  company?: string;
  phone?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface CoworkingSpace {
  id: string;
  name: string;
  city: string;
  address: string;
  pricePerDay: number;
  rating: number;
  imageUrl: string;
  amenities: Amenity[];
  description: string;
}

export interface Booking {
  id: number;
  spaceId: number;
  userId: number;
  date: string;
  status: 'confirmed' | 'pending';
  spaceName?: string;
  userName?: string;
  address?: string;
  pricePerDay?: number;
}

export interface AdminStat {
  label: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export enum Page {
  Home,
  Login,
  AdminDashboard,
}
