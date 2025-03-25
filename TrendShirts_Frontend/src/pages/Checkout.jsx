import React from 'react';
import AddressForm from '../components/checkout/AddressForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';

function Checkout() {
  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <AddressForm />
      <PaymentForm />
      <OrderSummary />
    </div>
  );
}

export default Checkout;