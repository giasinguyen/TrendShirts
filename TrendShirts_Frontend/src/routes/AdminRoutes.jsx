import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import AdminLayout from '../components/layout/admin/AdminLayout';

import Dashboard from '../pages/admin/Dashboard';
import ProductList from '../pages/admin/products/ProductList';
import ProductForm from '../pages/admin/products/ProductForm';
import CategoryList from '../pages/admin/categories/CategoryList';
import CategoryForm from '../pages/admin/categories/CategoryForm';
import OrderList from '../pages/admin/orders/OrderList';
import OrderDetails from '../pages/admin/orders/OrderDetails';

const AdminRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      console.log("AdminRoutes - Auth state:", { user });
      
      if (!user) {
        console.warn("No user found, redirecting to login");
        navigate('/login?redirect=admin');
      } else if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
        console.warn("User is not admin. Roles:", user.roles);
        navigate('/login?redirect=admin&error=notadmin');
      } else {
        console.log("Admin authentication successful, rendering dashboard");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading admin dashboard...</div>;
  }

  if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
    return null;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;