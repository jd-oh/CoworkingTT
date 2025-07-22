
import React from 'react';
import type { CoworkingSpace } from '../types';
import { MapPinIcon } from './Icon';

interface SpaceCardProps {
  space: CoworkingSpace;
  onSelect: (space: CoworkingSpace) => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer animate__animated animate__fadeInUp" onClick={() => onSelect(space)}>
      <img className="w-full h-48 object-cover" src={space.imageUrl} alt={space.name} />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h3>
          <div className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            {space.rating}
          </div>
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPinIcon className="w-5 h-5 mr-2" />
          <span>{space.city} - {space.address}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {space.amenities.slice(0, 3).map(amenity => (
                <span key={amenity.id} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                    {amenity.icon}
                    {amenity.name}
                </span>
            ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-indigo-600">€{space.pricePerDay}<span className="text-sm font-normal text-gray-500">/día</span></p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
