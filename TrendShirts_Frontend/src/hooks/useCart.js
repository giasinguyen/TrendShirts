import { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';

const useCart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const addToCart = (item) => {
    setLoading(true);
    setCartItems((prevItems) => [...prevItems, item]);
    setLoading(false);
  };

  const removeFromCart = (itemId) => {
    setLoading(true);
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    setLoading(false);
  };

  const clearCart = () => {
    setLoading(true);
    setCartItems([]);
    setLoading(false);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    loading,
  };
};

export default useCart;