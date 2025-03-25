import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product: ' + error.message);
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

export const fetchCartItems = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching cart items: ' + error.message);
  }
};