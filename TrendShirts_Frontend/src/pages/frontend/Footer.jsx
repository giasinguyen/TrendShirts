import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">TrendShirts</h3>
            <p className="mb-4 text-gray-400">
              Elevate your style with our premium collection of trendy shirts and fashion essentials.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-gray-400 hover:text-white">Men's Collection</Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-gray-400 hover:text-white">Women's Collection</Link>
              </li>
              <li>
                <Link to="/products?tag=new-arrivals" className="text-gray-400 hover:text-white">New Arrivals</Link>
              </li>
              <li>
                <Link to="/products?tag=sale" className="text-gray-400 hover:text-white">Sale Items</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Information</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-400 hover:text-white">Size Guide</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">Our Story</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-gray-400 hover:text-white">Sustainability</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} TrendShirts. All rights reserved.</p>
          <p className="mt-2">
            Designed and developed with ❤️ for quality fashion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;