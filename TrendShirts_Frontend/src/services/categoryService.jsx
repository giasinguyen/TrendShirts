import axios from 'axios';

const API_URL = '/api/categories';

/**
 * Lấy danh sách tất cả danh mục
 * @returns {Promise<Array>} Danh sách danh mục
 */
export const getCategories = async () => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockCategories();
    }
    
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Đổi tên hàm để tương thích với các import hiện tại
export const getAllCategories = getCategories;

/**
 * Lấy danh mục theo ID
 * @param {string} id - ID của danh mục
 * @returns {Promise<Object>} Thông tin danh mục
 */
export const getCategoryById = async (id) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      const categories = await getMockCategories();
      const category = categories.find(c => c.id === id);
      if (!category) throw new Error('Category not found');
      return category;
    }
    
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo danh mục mới
 * @param {Object} categoryData - Dữ liệu danh mục mới
 * @returns {Promise<Object>} Danh mục vừa tạo
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Cập nhật danh mục
 * @param {string} id - ID của danh mục cần cập nhật
 * @param {Object} categoryData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Danh mục đã cập nhật
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa danh mục
 * @param {string} id - ID của danh mục cần xóa
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

/**
 * Trả về dữ liệu mock cho danh mục khi không có backend
 * @returns {Promise<Array>}
 */
const getMockCategories = async () => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Men',
      slug: 'men',
      description: 'Clothing for men',
      imageUrl: 'https://via.placeholder.com/150?text=Men',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Women',
      slug: 'women',
      description: 'Clothing for women',
      imageUrl: 'https://via.placeholder.com/150?text=Women',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Kids',
      slug: 'kids',
      description: 'Clothing for kids',
      imageUrl: 'https://via.placeholder.com/150?text=Kids',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    },
    {
      id: '4',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Fashion accessories',
      imageUrl: 'https://via.placeholder.com/150?text=Accessories',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    },
    {
      id: '5',
      name: 'Sport',
      slug: 'sport',
      description: 'Sport clothing and accessories',
      imageUrl: 'https://via.placeholder.com/150?text=Sport',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    }
  ];
};