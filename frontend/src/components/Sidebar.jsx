import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Activity,
  Users,
  Settings,
  Stethoscope,
  FileText,
  BarChart3,
  ClipboardList,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isDoctor } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    const fullPath = location.pathname + location.search;
    return fullPath === path || location.pathname === path;
  };

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', label: 'Book Appointment', icon: Calendar },
    { path: '/records', label: 'Health Records', icon: Activity },
  ];

  const doctorLinks = [
    { path: '/doctor-panel?tab=overview', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctor-panel?tab=appointments', label: 'My Appointments', icon: Calendar },
    { path: '/doctor-panel?tab=patients', label: 'Patient Records', icon: FileText },
    { path: '/doctor-panel?tab=schedule', label: 'My Schedule', icon: ClipboardList },
  ];

  const adminLinks = [
    { path: '/admin-panel?tab=overview', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin-panel?tab=users', label: 'Manage Users', icon: Users },
    { path: '/admin-panel?tab=doctors', label: 'Manage Doctors', icon: Stethoscope },
    { path: '/admin-panel?tab=appointments', label: 'All Appointments', icon: Calendar },
    { path: '/admin-panel?tab=analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : userLinks;

  const getHeaderTitle = () => {
    if (isAdmin) return 'ADMIN PANEL';
    if (isDoctor) return 'DOCTOR PORTAL';
    return 'PATIENT PORTAL';
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-white h-screen w-64 shadow-lg fixed left-0 top-16 overflow-y-auto z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-4">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {getHeaderTitle()}
            </h2>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'System Management' : isDoctor ? 'Patient Care' : 'Health Management'}
            </p>
          </div>

          {isAdmin && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Management
              </p>
            </div>
          )}

          {isDoctor && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Doctor Tools
              </p>
            </div>
          )}

          {!isAdmin && !isDoctor && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                My Health
              </p>
            </div>
          )}

          <nav className="space-y-1">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={`${link.path}-${index}`}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">Quick Help</p>
              <p className="text-xs text-blue-700">
                {isAdmin ? 'Manage users, doctors, and system settings'
                 : isDoctor ? 'View and manage patient appointments'
                 : 'Track health, book appointments'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
