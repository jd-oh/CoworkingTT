
import React, { useState, useEffect, useMemo } from 'react';
import type { CoworkingSpace, User } from '../types';
import { searchSpaces } from '../services/coworkingService';
import { getStructuredSearchQuery } from '../services/geminiService';
import SpaceCard from '../components/SpaceCard';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { SparklesIcon, MapPinIcon, CalendarIcon } from '../components/Icon';

interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user: _user }) => {
  const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<CoworkingSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  
  const [selectedSpace, setSelectedSpace] = useState<CoworkingSpace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      const allSpaces = await searchSpaces();
      setSpaces(allSpaces);
      setFilteredSpaces(allSpaces);
      setIsLoading(false);
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    let result = spaces;
    if (cityFilter !== 'all') {
      result = spaces.filter(space => space.city === cityFilter);
    }
    setFilteredSpaces(result);
  }, [cityFilter, spaces]);

  const cities = useMemo(() => ['all', ...Array.from(new Set(spaces.map(s => s.city)))], [spaces]);

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsGeminiLoading(true);
    setIsLoading(true);
    
    const parsedQuery = await getStructuredSearchQuery(searchQuery);
    
    if (parsedQuery.city && cities.includes(parsedQuery.city)) {
        setCityFilter(parsedQuery.city);
    } else {
        setCityFilter('all');
    }

    const results = await searchSpaces(parsedQuery.city, parsedQuery.amenities);
    
    setFilteredSpaces(results);
    setIsGeminiLoading(false);
    setIsLoading(false);
  };

  const handleSelectSpace = (space: CoworkingSpace) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reserva para "${selectedSpace?.name}" en la fecha ${bookingDate} solicitada. ¡Recibirás una confirmación por email!`);
    handleCloseModal();
  };
  
  return (
    <main className="container mx-auto px-6 py-8">
      <section className="text-center bg-white p-10 rounded-2xl shadow-lg mb-12 animate__animated animate__fadeInDown">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Encuentra tu Espacio de Trabajo <span className="text-indigo-600">Perfecto</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Usa nuestra búsqueda inteligente para describir lo que necesitas. Por ejemplo: "un coworking en Madrid con café incluido y acceso 24/7".
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
              placeholder="Describe tu espacio ideal..."
              aria-label="Búsqueda inteligente de coworking"
              className="w-full pl-5 pr-32 py-4 text-lg text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              onClick={handleSmartSearch}
              disabled={isGeminiLoading}
              aria-label="Buscar con asistente de IA"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGeminiLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Espacios Disponibles</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <label htmlFor="city-filter" className="sr-only">Filtrar por ciudad</label>
              <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="city-filter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city === 'all' ? 'Todas las ciudades' : city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64" aria-live="polite">
            <Spinner size="lg" />
          </div>
        ) : filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.map(space => (
              <SpaceCard key={space.id} space={space} onSelect={handleSelectSpace} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No se encontraron espacios</h3>
            <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros. ¡El espacio perfecto te espera!</p>
          </div>
        )}
      </section>

      {selectedSpace && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Reservar en ${selectedSpace.name}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img src={selectedSpace.imageUrl} alt={selectedSpace.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
              <p className="mt-4 text-gray-600">{selectedSpace.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Servicios Incluidos</h3>
              <ul className="space-y-2 mb-6">
                {selectedSpace.amenities.map(amenity => (
                  <li key={amenity.id} className="flex items-center text-gray-700">
                    <span className="text-indigo-500 mr-3" aria-hidden="true">{amenity.icon}</span>
                    {amenity.name}
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg">
                <form onSubmit={handleBooking}>
                  <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2">Selecciona la fecha de tu reserva</label>
                  <div className="relative">
                    <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input 
                      type="date" 
                      id="booking-date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 mt-4">
                    Confirmar Reserva por €{selectedSpace.pricePerDay}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default HomePage;
