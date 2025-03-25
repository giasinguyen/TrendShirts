import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TrendShirts</h3>
            <p className="text-gray-400">Your destination for trendy and comfortable clothing.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/men" className="text-gray-400 hover:text-white">Men's Collection</Link></li>
              <li><Link to="/women" className="text-gray-400 hover:text-white">Women's Collection</Link></li>
              <li><Link to="/new" className="text-gray-400 hover:text-white">New Arrivals</Link></li>
              <li><Link to="/sale" className="text-gray-400 hover:text-white">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TrendShirts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};