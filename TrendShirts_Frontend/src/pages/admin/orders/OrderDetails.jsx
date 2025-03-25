import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../../services/orderService';
import { ShoppingBag, ArrowLeft, Truck, CreditCard, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Status options
  const statusOptions = [
    { value: 'PENDING', label: 'Pending', icon: CreditCard, color: 'text-yellow-500' },
    { value: 'PROCESSING', label: 'Processing', icon: Package, color: 'text-blue-500' },
    { value: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-purple-500' },
    { value: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
    { value: 'CANCELLED', label: 'Cancelled', icon: XCircle, color: 'text-red-500' }
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(id, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusDetails = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-indigo-600 mb-6" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Orders</span>
        </div>
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const statusDetail = getStatusDetails(order.status);
  const StatusIcon = statusDetail.icon;

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Orders</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.orderDate)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
          <StatusIcon className={`h-5 w-5 ${statusDetail.color}`} />
          <span className="font-medium">{statusDetail.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Items</h2>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="flex py-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.name}</h3>
                        <p className="ml-4">{formatCurrency(item.price)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.color && `Color: ${item.color}`}
                        {item.size && ` | Size: ${item.size}`}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Shipping Address</h2>
              <address className="not-italic">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </address>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Payment Information</h2>
              <p className="mb-2 font-medium">{order.paymentMethod}</p>
              {order.paymentMethod === 'Credit Card' && (
                <p className="text-gray-600">**** **** **** {order.lastFourDigits}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">Payment Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium">{formatCurrency(order.subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-sm font-medium">{formatCurrency(order.shippingCost)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Tax</p>
              <p className="text-sm font-medium">{formatCurrency(order.taxAmount)}</p>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <p className="font-medium">Total</p>
              <p className="font-bold">{formatCurrency(order.total)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-medium">Update Order Status</h3>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={updatingStatus || order.status === option.value}
                  className={`flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm ${
                    order.status === option.value
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <option.icon className={`mr-2 h-4 w-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                  {order.status === option.value && (
                    <span className="text-xs font-medium text-indigo-700">Current</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;