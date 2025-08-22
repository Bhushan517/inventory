import { Link, useLocation } from 'react-router-dom';
import { getUserRole, logout, getToken } from '../utils/auth';
import { useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const userRole = getUserRole();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Get user info from localStorage
  const getUsername = () => {
    return localStorage.getItem('username') || 'User';
  };

  const getCompanyName = () => {
    return localStorage.getItem('companyName') || 'Company';
  };

  const getNavigationItems = () => {
    const items = [];
    
    // Dashboard is available to all roles
    items.push({ name: 'Dashboard', path: '/dashboard', icon: '🏠' });
    
    // Role-specific navigation
    if (userRole === 'Admin') {
      items.push(
        { name: 'Users', path: '/users', icon: '👥' },
        { name: 'Products', path: '/products', icon: '📦' },
        { name: 'Transactions', path: '/transactions', icon: '📊' },
        { name: 'Reports', path: '/reports', icon: '📈' }
      );
    } else if (userRole === 'Manager') {
      items.push(
        { name: 'Users', path: '/users', icon: '👥' },
        { name: 'Products', path: '/products', icon: '📦' },
        { name: 'Transactions', path: '/transactions', icon: '📊' },
        { name: 'Reports', path: '/reports', icon: '📈' }
      );
    } else if (userRole === 'Staff') {
      items.push(
        { name: 'Transactions', path: '/transactions', icon: '📊' }
      );
    }
    
    return items;
  };

  const navigationItems = getNavigationItems();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📦</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Inventory Pro
                    </h1>
                    <p className="text-xs text-gray-500">
                      {getCompanyName()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                    } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-t-lg transition-all duration-200`}
                  >
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {getUsername()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userRole}
                  </div>
                </div>
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUsername().charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{getUsername()}</div>
                      <div className="text-xs text-gray-500">{userRole}</div>
                      <div className="text-xs text-indigo-600 font-medium">{getCompanyName()}</div>
                    </div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; {year} Inventory Management System. Made with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
