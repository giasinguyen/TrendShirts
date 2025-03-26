import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
// Sửa đường dẫn import context
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useCategory } from "../../contexts/CategoryContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { categories } = useCategory();
  const navigate = useNavigate();

  // Handle scroll event to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  <nav>
    <Link to="/">Home</Link>
    <Link to="/products">Products</Link>
    <Link to="/about">About</Link>
    <Link to="/contact">Contact</Link>
  </nav>;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-900">
              TrendShirts
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li className="relative group">
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Products
                </Link>
                {categories && categories.length > 0 && (
                  <div className="absolute left-0 mt-2 hidden w-48 rounded-md bg-white py-2 shadow-lg group-hover:block">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Search, User, Cart Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 rounded-md border border-gray-300 bg-gray-50 py-1 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </form>

            {/* User Account */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 hidden w-48 rounded-md bg-white py-2 shadow-lg group-hover:block">
                    <div className="border-b border-gray-100 px-4 py-2 text-sm font-medium">
                      {user?.name || "User"}
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {user?.roles?.includes("ADMIN") && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-gray-900"
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </form>

            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              All Products
            </Link>
            {categories && categories.length > 0 && (
              <div className="ml-4 space-y-1 border-l border-gray-200 pl-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="block rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Contact
            </Link>

            <div className="my-2 border-t border-gray-200 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">
                    Signed in as {user?.name || "User"}
                  </div>
                  <Link
                    to="/account"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    My Orders
                  </Link>
                  {user?.roles?.includes("ADMIN") && (
                    <Link
                      to="/admin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
