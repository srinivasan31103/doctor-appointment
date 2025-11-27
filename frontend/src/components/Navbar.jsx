import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle (only show when logged in) */}
            {user && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="text-lg sm:text-2xl font-bold text-primary-700">HealthCare+</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 rounded-lg">
                  <User className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs px-2 py-1 bg-primary-600 text-white rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (right side) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg">
                  <User className="h-5 w-5 text-primary-600" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 block">{user.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-primary-600 text-white rounded-full inline-block mt-1">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
