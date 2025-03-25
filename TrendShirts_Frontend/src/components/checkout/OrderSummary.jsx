import React from 'react';

const OrderSummary = ({ items, total }) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
    </div>
  );
};

export default OrderSummary;