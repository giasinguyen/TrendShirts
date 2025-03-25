import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';

// Sửa đường dẫn cho đúng với cấu trúc thư mục thực tế
import MainLayout from './pages/frontend/MainLayout';
import Home from './pages/frontend/Home';
import ProductDetail from './pages/frontend/catalog/ProductDetails';
import Cart from './pages/frontend/checkout/Cart';
import Checkout from './pages/frontend/checkout/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Đường dẫn Admin
import AdminLayout from './components/layout/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/products/ProductList';
import ProductForm from './pages/admin/products/ProductForm';
import CategoryList from './pages/admin/categories/CategoryList';
import CategoryForm from './pages/admin/categories/CategoryForm';
import OrderList from './pages/admin/orders/OrderList';
import OrderDetails from './pages/admin/orders/OrderDetails';

import ProtectedRoute from './routes/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="categories/new" element={<CategoryForm />} />
                  <Route path="categories/:id/edit" element={<CategoryForm />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                </Route>
              </Routes>
            </CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;