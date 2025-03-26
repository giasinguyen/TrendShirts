import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/admin/AdminLayout';

import Dashboard from '../pages/admin/Dashboard';
import ProductList from '../pages/admin/products/ProductList';
import ProductForm from '../pages/admin/products/ProductForm';
import CategoryList from '../pages/admin/categories/CategoryList';
import CategoryForm from '../pages/admin/categories/CategoryForm';
import OrderList from '../pages/admin/orders/OrderList';
import OrderDetails from '../pages/admin/orders/OrderDetails';

const AdminRoutes = () => {
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