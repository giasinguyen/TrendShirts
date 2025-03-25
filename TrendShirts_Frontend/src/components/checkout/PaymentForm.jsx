import React, { useState } from 'react';

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate payment information here
    if (!cardNumber || !expiryDate || !cvv) {
      setError('All fields are required');
      return;
    }
    // Process payment logic here
    console.log('Payment submitted:', { cardNumber, expiryDate, cvv });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment Information</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
        <input
          type="text"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="cvv">CVV</label>
        <input
          type="text"
          id="cvv"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;