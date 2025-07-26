
import React from 'react';
import type { User } from '../types';
import { Page } from '../types';
import { BuildingOfficeIcon } from './Icon';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onNavigate(Page.Home)}
        >
          <BuildingOfficeIcon className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-800">Coworking<span className="text-indigo-600">Inteligente</span></span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-600 hidden sm:block">Hola, {user.name}</span>
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate(Page.AdminDashboard)}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  Panel Admin
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate(Page.Login)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
