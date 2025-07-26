
import React from 'react';
import type { User } from '../types';
import { Page } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const handleLogin = (role: 'user' | 'admin') => {
    const user: User = {
      id: role === 'admin' ? 'admin01' : 'user01',
      name: role === 'admin' ? 'Admin' : 'Juan Viajero',
      email: role === 'admin' ? 'admin@cowork.io' : 'juan@email.com',
      role: role,
    };
    onLogin(user);
    if (role === 'admin') {
      onNavigate(Page.AdminDashboard);
    } else {
      onNavigate(Page.Home);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl animate__animated animate__fadeIn">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O selecciona un rol para una demostración
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email (simulado)" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Contraseña (simulada)" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </form>
        <div className="space-y-4">
           <button
              onClick={() => handleLogin('user')}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Entrar como Usuario
            </button>
            <button
              onClick={() => handleLogin('admin')}
              className="group relative w-full flex justify-center py-3 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Entrar como Administrador
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
