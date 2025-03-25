import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';

const CartSummary = () => {
  const { cartItems, totalAmount } = useContext(CartContext);

  return (
    <div className="cart-summary">
      <h2>Cart Summary</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${totalAmount}</h3>
    </div>
  );
};

export default CartSummary;