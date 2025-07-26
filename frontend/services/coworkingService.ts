import React from 'react';
import type { CoworkingSpace, AdminStat, Booking, Amenity } from '../types';
import { WifiIcon, UserGroupIcon } from '../components/Icon';

const amenityMap: Record<string, Amenity> = {
  wifi: { id: 'wifi', name: 'WiFi de Alta Velocidad', icon: React.createElement(WifiIcon, { className: 'w-5 h-5' }) },
  cafe: { id: 'cafe', name: 'Café Incluido', icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) },
  'sala-reuniones': { id: 'sala-reuniones', name: 'Salas de Reuniones', icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) },
  'acceso-24-7': { id: 'acceso-24-7', name: 'Acceso 24/7', icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) },
  parking: { id: 'parking', name: 'Parking Gratuito', icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) },
  'escritorio-de-pie': { id: 'escritorio-de-pie', name: 'Escritorios de Pie', icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) }
};

const parseAmenities = (amenities: string[]): Amenity[] => {
  return amenities.map(a => amenityMap[a] || { id: a, name: a, icon: React.createElement(UserGroupIcon, { className: 'w-5 h-5' }) });
};

export const searchSpaces = async (city?: string, amenities?: string[]): Promise<CoworkingSpace[]> => {
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (amenities && amenities.length > 0) params.append('amenities', amenities.join(','));

  const res = await fetch(`/api/spaces?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch spaces');
  }
  const data: Array<Omit<CoworkingSpace, 'amenities'> & { amenities: string[] }> = await res.json();
  return data.map(space => ({ ...space, amenities: parseAmenities(space.amenities) }));
};

export const getAdminStats = async (): Promise<AdminStat[]> => {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return res.json();
};

export const getRecentBookings = async (): Promise<(Booking & { spaceName: string; userName: string })[]> => {
  const res = await fetch('/api/admin/bookings/recent');
  if (!res.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return res.json();
};
