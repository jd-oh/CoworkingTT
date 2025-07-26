import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
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
  id: string;
  spaceId: string;
  userId: string;
  date: string;
  status: 'confirmed' | 'pending';
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
