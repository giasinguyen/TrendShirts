import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateItemQuantity, removeItem, clearCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  // Calculate subtotal, shipping cost and total
  const subtotal = cartTotal;
  const shippingCost = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  // Check for empty cart
  const isCartEmpty = cart.length === 0;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return; // Optional max limit
    
    updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">Shopping Cart</h1>

        {isCartEmpty ? (
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium">Items in Your Cart ({cart.length})</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex flex-col items-start sm:flex-row">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="mt-4 flex-1 sm:ml-6 sm:mt-0">
                          <div className="flex flex-col justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                <Link to={`/products/${item.productId}`} className="hover:text-indigo-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.size && <span> | Size: {item.size}</span>}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(item.price)}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="flex h-8 w-10 items-center justify-center border-l border-r border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-between">
                    <Link
                      to="/products"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => clearCart()}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-6 rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-medium">Order Summary</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">{formatCurrency(subtotal)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-medium">{formatCurrency(shippingCost)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <p className="text-base font-medium">Total</p>
                        <p className="text-base font-bold">{formatCurrency(total)}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Including taxes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;