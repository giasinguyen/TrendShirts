import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      path: '/admin'
    },
    {
      name: 'Products',
      icon: <ShoppingBag className="mr-3 h-5 w-5" />,
      path: '/admin/products',
      children: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add New Product', path: '/admin/products/new' }
      ]
    },
    {
      name: 'Categories',
      icon: <Tag className="mr-3 h-5 w-5" />,
      path: '/admin/categories',
      children: [
        { name: 'All Categories', path: '/admin/categories' },
        { name: 'Add New Category', path: '/admin/categories/new' }
      ]
    },
    {
      name: 'Orders',
      icon: <ShoppingCart className="mr-3 h-5 w-5" />,
      path: '/admin/orders'
    },
    {
      name: 'Customers',
      icon: <Users className="mr-3 h-5 w-5" />,
      path: '/admin/customers'
    },
    {
      name: 'Settings',
      icon: <Settings className="mr-3 h-5 w-5" />,
      path: '/admin/settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for medium and larger screens */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-md transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link to="/admin" className="text-xl font-bold text-indigo-600">
                Admin Panel
              </Link>
              <button 
                onClick={toggleSidebar} 
                className="md:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="mt-5 px-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className={`flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium ${
                            isActive(item.path)
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            {item.icon}
                            {item.name}
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openSubmenu === item.name ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openSubmenu === item.name && (
                          <ul className="ml-6 mt-2 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  to={child.path}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={`block rounded-md px-4 py-2 text-sm ${
                                    location.pathname === child.path
                                      ? 'bg-indigo-50 text-indigo-600'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                          isActive(item.path)
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4 md:ml-auto">
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden items-center rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100 md:flex"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                View Store
              </a>
              <span className="text-sm font-medium text-gray-700 md:block">
                {user?.name || 'Admin User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;