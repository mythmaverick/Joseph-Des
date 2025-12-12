import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, User, LogOut, MessageCircle } from 'lucide-react';

interface NavBarProps {
  role: UserRole;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const NavBar: React.FC<NavBarProps> = ({ role, onLogout, onNavigate, currentPage }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              Campus<span className="text-green-600">Markets</span>
            </span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {role !== UserRole.GUEST && (
              <>
                <button 
                  onClick={() => onNavigate('marketplace')}
                  className={`${currentPage === 'marketplace' ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-900'} transition`}
                >
                  Marketplace
                </button>
                {role === UserRole.SELLER && (
                   <button 
                   onClick={() => onNavigate('dashboard')}
                   className={`${currentPage === 'dashboard' ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-900'} transition`}
                 >
                   My Stall
                 </button>
                )}
                 <button 
                  onClick={() => onNavigate('chat')}
                  className={`${currentPage === 'chat' ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-900'} transition flex items-center gap-1`}
                >
                  <MessageCircle size={18} /> Chats
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {role === UserRole.GUEST ? (
              <span className="text-sm text-gray-500 italic">Join the hustle!</span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                  {role}
                </span>
                <button 
                  onClick={onLogout}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;