import axios from "axios";

// Hàm giải mã JWT không phụ thuộc vào thư viện
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT', e);
    return null;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_URL = `${API_BASE_URL}/api/auth`;

// Thêm log để kiểm tra URL
console.log('API URL configured as:', API_URL);

// Sửa lại phương thức login
export const login = async ({ email, password }) => {
  try {
    // Kiểm tra xem có sử dụng mock API không
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      console.log('Using mock login');
      return mockLogin(email, password);
    }

    // Kiểm tra URL API
    console.log('Calling real API with URL:', `${API_URL}/login`);
    console.log('Login payload:', { email, password });
    
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login response received:', response);

    // Lưu token và user vào localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Login error full details:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("User from localStorage:", user);
      
      // Đảm bảo roles có đúng định dạng (mảng)
      if (user.roles && !Array.isArray(user.roles)) {
        if (typeof user.roles === 'string') {
          user.roles = [user.roles];
        } else {
          console.warn("Unexpected roles format:", user.roles);
        }
      }
      
      return user;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  }
  
  // Nếu không có user object trong localStorage, thử lấy từ token
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      return {
        id: decodedToken.id,
        email: decodedToken.sub,
        name: decodedToken.name,
        roles: Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles]
      };
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  return null;
};

export const register = async (userData) => {
  try {
    // Kiểm tra xem có sử dụng mock API không
    if (import.meta.env.VITE_USE_MOCK_API === "true") {
      return mockRegister(userData);
    }

    console.log("Calling real API for registration:", API_URL);
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Mock functions
const mockLogin = (email, password) => {
  if (email === 'admin@example.com' && password === 'admin') {
    const mockData = {
      token: 'mock-jwt-token',
      id: 1,
      email: 'admin@example.com',
      name: 'Admin User',
      roles: ['ROLE_ADMIN']
    };
    
    localStorage.setItem('token', mockData.token);
    localStorage.setItem('user', JSON.stringify(mockData));
    return Promise.resolve(mockData);
  }
  
  return Promise.reject(new Error('Invalid email or password'));
};

const mockRegister = (userData) => {
  // Kiểm tra dữ liệu đầu vào
  if (!userData.email || !userData.password) {
    return Promise.reject(new Error("Email and password are required"));
  }

  // Giả lập thành công
  return Promise.resolve({
    success: true,
    message: "Registration successful! You can now login."
  });
};