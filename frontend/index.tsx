
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { AddSpaceForm } from './components/AddSpaceForm';
import type { User } from './types';
import { Page } from './types';
import { getAdminStats, getRecentBookings } from './services/coworkingService';
import type { AdminStat, Booking } from './types';
import { ArrowUpIcon, ArrowDownIcon } from './components/Icon';
import Spinner from './components/Spinner';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStat[]>([]);
    const [bookings, setBookings] = useState<(Booking & { spaceName: string; userName: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'add-space'>('dashboard');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [adminStats, recentBookings] = await Promise.all([
                getAdminStats(),
                getRecentBookings(),
            ]);
            setStats(adminStats);
            setBookings(recentBookings);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    const renderContent = () => {
        if (activeTab === 'add-space') {
            return (
                <div className="animate__animated animate__fadeIn">
                    <AddSpaceForm />
                </div>
            );
        }

        return (
            <div className="animate__animated animate__fadeIn">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <div className="flex items-end justify-between mt-2">
                               <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                               {stat.change && (
                                    <span className={`flex items-center text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.changeType === 'increase' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                                        {stat.change}
                                    </span>
                               )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Reservas Recientes</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.spaceName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Administrador</h1>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mb-8">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'dashboard'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('add-space')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'add-space'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        ➕ Agregar Espacio
                    </button>
                </nav>
            </div>

            {renderContent()}
        </div>
    );
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage(loggedInUser.role === 'admin' ? Page.AdminDashboard : Page.Home);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.Home);
  };
  
  const handleNavigate = (page: Page) => {
    // Prevent non-admins from accessing the dashboard
    if (page === Page.AdminDashboard && user?.role !== 'admin') {
      setCurrentPage(Page.Login);
      return;
    }
    setCurrentPage(page);
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Login:
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case Page.AdminDashboard:
        return user?.role === 'admin' ? <AdminDashboard /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate}/>;
      case Page.Home:
      default:
        return <HomePage user={user} />;
    }
  };

  return (
    <>
      <Header user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      {renderPage()}
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
