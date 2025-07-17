import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Factory } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Factory className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">METEP</h1>
              <p className="text-sm text-slate-300">Análisis de Microparos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-slate-300" />
              <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;