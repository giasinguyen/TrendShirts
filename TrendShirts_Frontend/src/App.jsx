import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import About from "./pages/frontend/About";
import Contact from "./pages/frontend/Contact";
import MainLayout from "./pages/frontend/MainLayout";
import Home from "./pages/frontend/Home";
import ProductDetail from "./pages/frontend/catalog/ProductDetails";
import Cart from "./pages/frontend/checkout/Cart";
import Checkout from "./pages/frontend/checkout/Checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductList from "./pages/frontend/catalog/ProductList";
import ProtectedRoute from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
// App.jsx
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
                  <Route path="products" element={<ProductList />} />{" "}
                  {/* Thêm route này */}
                  <Route path="products/:id" element={<ProductDetail />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
                {/* Admin routes - Sử dụng component AdminRoutes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminRoutes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;
