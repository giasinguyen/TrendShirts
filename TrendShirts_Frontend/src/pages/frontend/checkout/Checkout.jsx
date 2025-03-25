import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { createOrder } from '../../../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  
  // Calculate totals
  const subtotal = cartTotal;
  const shippingCost = subtotal > 0 ? 5.99 : 0;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    saveInfo: false
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
    
    // Attempt to load saved shipping info from localStorage
    const savedInfo = localStorage.getItem('shippingInfo');
    if (savedInfo) {
      setShippingInfo(JSON.parse(savedInfo));
    }
  }, [cart, navigate, orderSuccess]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For card number, only allow digits and limit to 19 chars (16 digits + 3 spaces)
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '') // Remove non-digits
        .replace(/(\d{4})(?=\d)/g, '$1 ') // Add space after every 4 digits
        .substring(0, 19); // Limit length
      
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // For expiry date, format as MM/YY
    else if (name === 'expiryDate') {
      const digits = value.replace(/\D/g, '');
      let formattedValue = digits;
      if (digits.length > 2) {
        formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
      }
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    }
    // For CVV, only allow 3-4 digits
    else if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    }
    else {
      setPaymentInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateShippingInfo = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentInfo = () => {
    const newErrors = {};
    
    if (!paymentInfo.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid';
    
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
      const currentMonth = new Date().getMonth() + 1; // 1-12
      
      if (!month || !year || month > 12) {
        newErrors.expiryDate = 'Invalid expiry date';
      } else if ((parseInt(year) < currentYear) || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (paymentInfo.cvv.length < 3) newErrors.cvv = 'CVV is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinueToPayment = () => {
    if (validateShippingInfo()) {
      if (shippingInfo.saveInfo) {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
      }
      setActiveStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!validatePaymentInfo()) return;
    
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone
        },
        customerEmail: shippingInfo.email,
        subtotal,
        shippingCost,
        taxAmount,
        total,
        paymentMethod: 'Credit Card',
        lastFourDigits: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)
      };
      
      // In a real app, you'd send the payment info to a payment processor
      // and only create the order after payment is successful
      
      // For demo purposes, we'll simulate a successful order
      // const response = await createOrder(orderData);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockOrderNumber = `TN-${Date.now().toString().slice(-6)}`;
      setOrderNumber(mockOrderNumber);
      setOrderSuccess(true);
      clearCart();
      
      // In a real implementation, you'd use the response from your API:
      // setOrderNumber(response.orderNumber);
      
      setActiveStep(3);
    } catch (error) {
      console.error('Order placement failed:', error);
      setErrors({ form: 'Failed to place your order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  // If order is successful, show confirmation
  if (orderSuccess) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-bold">Order Confirmed!</h1>
              <p className="mt-2 text-gray-600">Thank you for your purchase</p>
              <p className="mt-1 text-sm font-medium text-gray-800">Order #{orderNumber}</p>
            </div>
            
            <div className="mb-6 rounded-md bg-gray-50 p-4">
              <h2 className="text-lg font-medium">Order Summary</h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                A confirmation email has been sent to {shippingInfo.email}
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${activeStep >= 1 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400'}`}>
                  1
                </div>
                <span className="mt-1 text-xs">Shipping</span>
              </div>
              <div className={`h-1 w-16 ${activeStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${activeStep >= 2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400'}`}>
                  2
                </div>
                <span className="mt-1 text-xs">Payment</span>
              </div>
              <div className={`h-1 w-16 ${activeStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${activeStep >= 3 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400'}`}>
                  3
                </div>
                <span className="mt-1 text-xs">Confirmation</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-lg bg-white shadow-sm">
              {/* Shipping Information - Step 1 */}
              {activeStep === 1 && (
                <div>
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium">Shipping Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.fullName ? 'border-red-300' : ''}`}
                        />
                        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-300' : ''}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.phone ? 'border-red-300' : ''}`}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.address ? 'border-red-300' : ''}`}
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.city ? 'border-red-300' : ''}`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.state ? 'border-red-300' : ''}`}
                        />
                        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          Postal / Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.zipCode ? 'border-red-300' : ''}`}
                        />
                        {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="USA">United States</option>
                          <option value="CAN">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AUS">Australia</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex items-center">
                          <input
                            id="saveInfo"
                            name="saveInfo"
                            type="checkbox"
                            checked={shippingInfo.saveInfo}
                            onChange={handleShippingChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-600">
                            Save this information for next time
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleContinueToPayment}
                        className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span>Continue to Payment</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment Information - Step 2 */}
              {activeStep === 2 && (
                <div>
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium">Payment Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-500">Your payment information is secure and encrypted</p>
                    </div>
                    
                    {errors.form && (
                      <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
                        {errors.form}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={paymentInfo.cardHolder}
                          onChange={handlePaymentChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.cardHolder ? 'border-red-300' : ''}`}
                        />
                        {errors.cardHolder && <p className="mt-1 text-xs text-red-600">{errors.cardHolder}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.cardNumber ? 'border-red-300' : ''}`}
                        />
                        {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.expiryDate ? 'border-red-300' : ''}`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.cvv ? 'border-red-300' : ''}`}
                        />
                        {errors.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex items-center">
                          <input
                            id="saveCard"
                            name="saveCard"
                            type="checkbox"
                            checked={paymentInfo.saveCard}
                            onChange={handlePaymentChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="saveCard" className="ml-2 text-sm text-gray-600">
                            Save this card for future purchases
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => setActiveStep(1)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="sticky top-6 rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <p className="mt-1 text-sm text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
              <div className="max-h-96 overflow-y-auto p-6">
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.id} className="flex items-start">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.color && `Color: ${item.color}`}{item.size && ` | Size: ${item.size}`}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium">{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-sm font-medium">{formatCurrency(shippingCost)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Tax ({(taxRate * 100).toFixed(0)}%)</p>
                    <p className="text-sm font-medium">{formatCurrency(taxAmount)}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-bold text-gray-900">{formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;