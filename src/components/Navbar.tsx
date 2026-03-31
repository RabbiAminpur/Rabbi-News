import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, logout } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { CATEGORIES } from '../types';

export const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600 font-serif">
              বাংলা নিউজ
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/?category=${cat}`} className="text-gray-700 hover:text-red-600 font-medium">
                {cat}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4 ml-4 border-l pl-4">
                <Link to="/admin" className="text-gray-700 hover:text-red-600 flex items-center gap-1">
                  <LayoutDashboard size={18} />
                  <span>ড্যাশবোর্ড</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 flex items-center gap-1">
                  <LogOut size={18} />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-red-600 flex items-center gap-1 ml-4 border-l pl-4">
                <LogIn size={18} />
                <span>লগইন</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat} 
              to={`/?category=${cat}`} 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
          <div className="pt-4 border-t mt-2">
            {user ? (
              <>
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ড্যাশবোর্ড
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                লগইন
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
