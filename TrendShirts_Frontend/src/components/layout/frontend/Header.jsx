import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">TrendShirts</Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/men" className="text-gray-600 hover:text-black">Men</Link>
            <Link to="/women" className="text-gray-600 hover:text-black">Women</Link>
            <Link to="/new" className="text-gray-600 hover:text-black">New Arrivals</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;