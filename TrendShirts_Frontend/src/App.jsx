import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CategoryProvider } from './contexts/CategoryContext'; // Thêm import này

// Thay thế các import hiện tại với các đường dẫn chính xác:

// Layouts
import MainLayout from './pages/frontend/MainLayout';

// Public Pages
import Home from './pages/frontend/Home';
import ShopPage from './pages/frontend/catalog/ProductList';
import ProductDetails from './pages/frontend/catalog/ProductDetails';
import CartPage from './pages/frontend/checkout/Cart';
import CheckoutPage from './pages/frontend/checkout/Checkout';
import AboutPage from './pages/frontend/About';
import ContactPage from './pages/frontend/Contact';

// Giữ nguyên import các trang auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';


// User Pages
// import UserProfile from './pages/user/UserProfile';
// import OrderHistory from './pages/user/OrderHistory';
import OrderDetails from './pages/admin/orders/OrderDetails';

// Admin Routes
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
        <CategoryProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              {/* <Route path="order-confirmation/:id" element={<OrderConfirmation />} /> */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes (Protected) */}
            <Route path="/account" element={<ProtectedRoute />}>
              {/* <Route path="profile" element={<UserProfile />} /> */}
              {/* <Route path="orders" element={<OrderHistory />} /> */}
              <Route path="orders/:id" element={<OrderDetails />} />
            </Route>

            <Route path="/admin/*" element={<AdminRoutes />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </CategoryProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;