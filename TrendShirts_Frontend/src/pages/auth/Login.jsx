import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// Xóa import CSS: import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Lấy redirect URL từ query string
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });
      const response = await login({ email, password });
      console.log("Login successful:", response);

      // Redirect sau khi đăng nhập thành công
      navigate(redirect.startsWith("/") ? redirect : `/${redirect}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm loginAsAdmin
  const loginAsAdmin = async () => {
    setLoading(true);
    setError("");

    try {
      // Sử dụng tài khoản admin mặc định
      const response = await login({
        email: "admin@example.com",
        password: "admin",
      });

      console.log("Admin login successful:", response);

      // Thêm delay nhỏ để đảm bảo context được cập nhật đầy đủ
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 100);
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Không thể đăng nhập bằng tài khoản admin.");
    } finally {
      setLoading(false);
    }
  };

  // Thêm một direct link ở cuối phần nav
  <div className="mt-4 text-center">
    <Link
      to="/admin/dashboard"
      className="text-sm text-red-500 hover:underline"
    >
      Debug: Đi trực tiếp đến dashboard (chỉ để test)
    </Link>
  </div>;

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Đăng nhập
          </h2>

          {error && (
            <div
              className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <button
                type="button"
                onClick={loginAsAdmin}
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                Đăng nhập với Admin
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Đăng ký
                </Link>
              </p>
              <p className="mt-2">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
