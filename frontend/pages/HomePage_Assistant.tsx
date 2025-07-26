import React, { useState, useEffect, useMemo } from 'react';
import type { CoworkingSpace, User, Booking } from '../types';
import { searchSpaces, createBooking, getUserBookings } from '../services/coworkingService';
import { getAssistantResponse, AssistantResponse } from '../services/geminiService';
import SpaceCard from '../components/SpaceCard';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { SparklesIcon, MapPinIcon, CalendarIcon } from '../components/Icon';

interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<CoworkingSpace[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<AssistantResponse | null>(null);
  const [cityFilter, setCityFilter] = useState<string>('all');
  
  const [selectedSpace, setSelectedSpace] = useState<CoworkingSpace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    const fetchUserBookings = async () => {
      if (user) {
        setIsLoadingBookings(true);
        try {
          const bookings = await getUserBookings(user.id);
          setUserBookings(bookings);
        } catch (error) {
          console.error('Error fetching user bookings:', error);
        } finally {
          setIsLoadingBookings(false);
        }
      } else {
        setUserBookings([]);
      }
    };
    fetchUserBookings();
  }, [user]);

  useEffect(() => {
    let result = spaces;
    if (cityFilter !== 'all') {
      result = spaces.filter(space => space.city === cityFilter);
    }
    setFilteredSpaces(result);
  }, [cityFilter, spaces]);

  const cities = useMemo(() => ['all', ...Array.from(new Set(spaces.map(s => s.city)))], [spaces]);

  const handleAssistantBooking = async (spaceName: string, date: string) => {
    if (!user) {
      setAssistantResponse({
        action: 'book',
        message: 'Para hacer una reserva necesitas iniciar sesión primero.'
      });
      return;
    }

    const space = spaces.find(s => 
      s.name.toLowerCase().includes(spaceName.toLowerCase())
    );
    
    if (!space) {
      setAssistantResponse({
        action: 'book',
        message: `No encontré un espacio llamado "${spaceName}". Los espacios disponibles son: ${spaces.map(s => s.name).join(', ')}`
      });
      return;
    }

    setIsBookingLoading(true);
    try {
      await createBooking(space.id, user.id, date);
      setAssistantResponse({
        action: 'book',
        message: `¡Perfecto! He confirmado tu reserva en ${space.name} para el ${new Date(date).toLocaleDateString('es-ES')}. ¡Que disfrutes tu espacio de trabajo!`
      });
      
      // Reload user bookings
      const bookings = await getUserBookings(user.id);
      setUserBookings(bookings);
      
    } catch (error) {
      setAssistantResponse({
        action: 'book',
        message: `Hubo un error al procesar tu reserva: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleAssistantQuery = async () => {
    if (!assistantQuery.trim()) return;

    console.log("Starting assistant query:", assistantQuery);
    setIsAssistantLoading(true);
    setAssistantResponse(null);
    
    try {
      const response = await getAssistantResponse(assistantQuery);
      console.log("Received assistant response:", response);
      setAssistantResponse(response);
      
      if (response.action === 'search') {
        // Handle search action
        setIsLoading(true);
        const results = await searchSpaces(response.city, response.amenities);
        setFilteredSpaces(results);
        if (response.city && cities.includes(response.city)) {
          setCityFilter(response.city);
        }
        setIsLoading(false);
      } else if (response.action === 'book') {
        // Handle booking action
        if (response.spaceName && response.date && user) {
          await handleAssistantBooking(response.spaceName, response.date);
        } else if (!user) {
          setAssistantResponse({
            ...response,
            message: 'Para hacer una reserva necesitas iniciar sesión primero.'
          });
        }
      }
    } catch (error) {
      console.error("Error in assistant query:", error);
      setAssistantResponse({
        action: 'unknown',
        message: 'Lo siento, hubo un error procesando tu petición. Inténtalo de nuevo.'
      });
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleSelectSpace = (space: CoworkingSpace) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
    setBookingMessage(null);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setBookingMessage({
        type: 'error',
        text: 'Debes iniciar sesión para hacer una reserva.'
      });
      return;
    }

    // Check if space is selected
    if (!selectedSpace) return;

    setIsBookingLoading(true);
    setBookingMessage(null);

    try {
      await createBooking(selectedSpace.id, user.id, bookingDate);
      setBookingMessage({
        type: 'success',
        text: `¡Reserva confirmada para "${selectedSpace.name}" el ${bookingDate}! Recibirás una confirmación por email.`
      });
      
      // Reload user bookings
      try {
        const bookings = await getUserBookings(user.id);
        setUserBookings(bookings);
      } catch (error) {
        console.error('Error reloading bookings:', error);
      }
      
      // Close modal after 2 seconds on success
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setBookingMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al crear la reserva. Inténtalo de nuevo.'
      });
    } finally {
      setIsBookingLoading(false);
    }
  };
  
  return (
    <main className="container mx-auto px-6 py-8">
      <section className="text-center bg-white p-10 rounded-2xl shadow-lg mb-12 animate__animated animate__fadeInDown">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Asistente de Coworking <span className="text-indigo-600">Inteligente</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Dime qué necesitas y yo te ayudo. Puedes pedirme que busque espacios o hacer reservas directamente. 
          Por ejemplo: "reserva para el 26/07/2025 en BCN Hub Creativo" o "busca coworking en Madrid con café".
        </p>
        
        {/* Assistant Response */}
        {assistantResponse && (
          <div className={`mb-6 p-4 rounded-lg ${
            assistantResponse.action === 'book' 
              ? 'bg-green-100 border border-green-400 text-green-800'
              : assistantResponse.action === 'search'
              ? 'bg-blue-100 border border-blue-400 text-blue-800'
              : 'bg-yellow-100 border border-yellow-400 text-yellow-800'
          }`}>
            <p className="font-medium">{assistantResponse.message}</p>
            {isBookingLoading && (
              <div className="mt-2 flex items-center justify-center">
                <Spinner size="sm" />
                <span className="ml-2">Procesando reserva...</span>
              </div>
            )}
          </div>
        )}
        
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssistantQuery()}
              placeholder="Escribe tu petición... ej: reserva para mañana en BCN Hub"
              aria-label="Asistente de coworking"
              className="w-full pl-5 pr-32 py-4 text-lg text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              onClick={handleAssistantQuery}
              disabled={isAssistantLoading}
              aria-label="Enviar petición al asistente"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAssistantLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
              <span>Preguntar</span>
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

      {/* User Bookings Section */}
      {user && (
        <section className="mt-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Reservas</h2>
            {isLoadingBookings ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="lg" />
              </div>
            ) : userBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBookings.map(booking => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">{booking.spaceName || `Espacio ID: ${booking.spaceId}`}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Fecha:</strong> {new Date(booking.date).toLocaleDateString('es-ES')}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' : 
                           booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Reserva #{booking.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">No tienes reservas aún</p>
                <p className="text-sm text-gray-500">¡Explora nuestros espacios y haz tu primera reserva!</p>
              </div>
            )}
          </div>
        </section>
      )}

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
                {bookingMessage && (
                  <div className={`mb-4 p-3 rounded-md ${
                    bookingMessage.type === 'success' 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    {bookingMessage.text}
                  </div>
                )}
                
                {!user && (
                  <div className="mb-4 p-3 rounded-md bg-yellow-100 border border-yellow-400 text-yellow-700">
                    <p>Para hacer una reserva, debes <strong>iniciar sesión</strong> primero.</p>
                  </div>
                )}
                
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
                      disabled={!user || isBookingLoading}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!user || isBookingLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 mt-4 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isBookingLoading ? (
                      <>
                        <Spinner size="sm" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <span>
                        {user ? `Confirmar Reserva por €${selectedSpace.pricePerDay}` : 'Inicia sesión para reservar'}
                      </span>
                    )}
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
