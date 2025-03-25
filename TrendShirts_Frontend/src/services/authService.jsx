import axios from 'axios';

const API_URL = '/api/auth';

/**
 * Đăng nhập người dùng
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Dữ liệu người dùng và token
 */
export const login = async (email, password) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return mockLogin(email, password);
    }
    
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Set default authorization header cho axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Promise<Object>} Dữ liệu người dùng và token
 */
export const register = async (userData) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return mockRegister(userData);
    }
    
    const response = await axios.post(`${API_URL}/register`, userData);
    
    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Set default authorization header cho axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns {Promise<Object>} Dữ liệu người dùng
 */
export const getCurrentUser = async () => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return mockGetCurrentUser();
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Đăng xuất người dùng
 */
export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

// Mock functions for development without backend

/**
 * Mock login function for development
 */
const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'admin@example.com' && password === 'admin123') {
    const user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      roles: ['ADMIN', 'USER'],
      avatar: 'https://i.pravatar.cc/150?u=admin'
    };
    
    const token = 'mock-jwt-token-admin';
    
    return { user, token };
  } else if (email === 'user@example.com' && password === 'user123') {
    const user = {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      roles: ['USER'],
      avatar: 'https://i.pravatar.cc/150?u=user'
    };
    
    const token = 'mock-jwt-token-user';
    
    return { user, token };
  } else {
    throw new Error('Invalid email or password');
  }
};

/**
 * Mock register function for development
 */
const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (['admin@example.com', 'user@example.com'].includes(userData.email)) {
    throw new Error('Email already exists');
  }
  
  const user = {
    id: '3',
    name: userData.name,
    email: userData.email,
    roles: ['USER'],
    avatar: `https://i.pravatar.cc/150?u=${userData.email}`
  };
  
  const token = 'mock-jwt-token-new-user';
  
  return { user, token };
};

/**
 * Mock get current user function for development
 */
const mockGetCurrentUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const token = localStorage.getItem('token');
  
  if (token === 'mock-jwt-token-admin') {
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      roles: ['ADMIN', 'USER'],
      avatar: 'https://i.pravatar.cc/150?u=admin'
    };
  } else if (token === 'mock-jwt-token-user') {
    return {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      roles: ['USER'],
      avatar: 'https://i.pravatar.cc/150?u=user'
    };
  } else if (token === 'mock-jwt-token-new-user') {
    return {
      id: '3',
      name: 'New User',
      email: 'new@example.com',
      roles: ['USER'],
      avatar: 'https://i.pravatar.cc/150?u=new'
    };
  } else {
    throw new Error('Invalid token');
  }
};