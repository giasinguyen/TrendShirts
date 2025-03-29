import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch actual data
        // const data = await getOrderStatistics();
        
        // For now, using mock data
        setTimeout(() => {
          setStats({
            totalOrders: 157,
            totalCustomers: 89,
            totalRevenue: 12760.85,
            totalProducts: 42,
            recentOrders: [
              { id: '1001', orderNumber: '10598', customer: 'John Smith', total: 125.99, status: 'DELIVERED', date: '2025-03-24T15:30:00Z' },
              { id: '1002', orderNumber: '10597', customer: 'Emma Johnson', total: 89.50, status: 'SHIPPED', date: '2025-03-24T10:15:00Z' },
              { id: '1003', orderNumber: '10596', customer: 'Michael Brown', total: 210.75, status: 'PROCESSING', date: '2025-03-23T16:20:00Z' },
              { id: '1004', orderNumber: '10595', customer: 'Sophia Williams', total: 55.25, status: 'PENDING', date: '2025-03-23T09:45:00Z' },
              { id: '1005', orderNumber: '10594', customer: 'James Davis', total: 175.00, status: 'DELIVERED', date: '2025-03-22T14:10:00Z' }
            ],
            monthlySales: [
              { month: 'Jan', sales: 4200 },
              { month: 'Feb', sales: 5100 },
              { month: 'Mar', sales: 5900 },
              { month: 'Apr', sales: 6100 },
              { month: 'May', sales: 7000 },
              { month: 'Jun', sales: 7800 },
            ],
            popularProducts: [
              { id: '1', name: 'Classic T-Shirt', sales: 42, amount: 1259.58 },
              { id: '2', name: 'Slim Fit Jeans', sales: 38, amount: 2279.62 },
              { id: '3', name: 'Summer Dress', sales: 31, amount: 1549.69 },
              { id: '4', name: 'Leather Jacket', sales: 28, amount: 5599.72 }
            ]
          });
          setLoading(false);
        }, 800);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800' },
      'PROCESSING': { color: 'bg-blue-100 text-blue-800' },
      'SHIPPED': { color: 'bg-purple-100 text-purple-800' },
      'DELIVERED': { color: 'bg-green-100 text-green-800' },
      'CANCELLED': { color: 'bg-red-100 text-red-800' }
    };
    
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
              <p className="text-2xl font-semibold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600">
                        <Link to={`/admin/orders/${order.id}`}>#{order.orderNumber}</Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.color}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all orders
            </Link>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium">Popular Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Units Sold</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.popularProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600">
                      <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.sales}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(product.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link to="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all products
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Order Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">12</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Processing</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-800">Shipped</p>
                  <p className="text-2xl font-bold text-purple-600">15</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">122</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Monthly Sales</h2>
          <div className="h-64">
            <div className="flex h-full items-end">
              {stats.monthlySales.map((data, index) => (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div 
                    className="w-full bg-indigo-500 transition-all duration-300 hover:bg-indigo-600" 
                    style={{ 
                      height: `${(data.sales / 8000) * 100}%`, 
                      marginLeft: '3px', 
                      marginRight: '3px' 
                    }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;