import axios from 'axios';

const API_URL = 'https://api.example.com/auth'; // Replace with your actual API URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    throw new Error(error.response.data.message || 'Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/current`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to fetch current user');
  }
};