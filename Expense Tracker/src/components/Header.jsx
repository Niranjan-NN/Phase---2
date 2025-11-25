import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="md:hidden">
          <button 
            className="text-gray-500 hover:text-gray-700 focus:outline-none" 
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex-1 md:ml-8">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 hidden md:block">
            Expense Tracker
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Notifications">
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <span className="hidden md:block text-sm text-gray-700">{currentUser?.name || 'User'}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;