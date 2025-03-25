import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">ShirtStore</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'text-primary' : 'text-gray-700'} hover:text-primary transition-colors`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`${location.pathname.includes('/products') ? 'text-primary' : 'text-gray-700'} hover:text-primary transition-colors`}
              >
                Products
              </Link>
            </nav>
            
            {/* User menu & cart */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-primary transition-colors relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs font-semibold w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
              
              {currentUser ? (
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Link to="/profile" className="text-gray-700 hover:text-primary transition-colors">
                      <span className="mr-1">My Account</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShirtStore</h3>
              <p className="text-gray-600">
                Quality apparel for every occasion.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link to="/products?category=tshirts" className="text-gray-600 hover:text-primary">T-Shirts</Link></li>
                <li><Link to="/products?category=shirts" className="text-gray-600 hover:text-primary">Shirts</Link></li>
                <li><Link to="/products?category=hoodies" className="text-gray-600 hover:text-primary">Hoodies</Link></li>
                <li><Link to="/products?category=accessories" className="text-gray-600 hover:text-primary">Accessories</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Info</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Shipping</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: info@shirtstore.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Fashion St, Style City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ShirtStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;