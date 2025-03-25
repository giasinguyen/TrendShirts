import axios from 'axios';

const API_URL = '/api/orders';

/**
 * Lấy thống kê đơn hàng cho dashboard
 * @returns {Promise<Object>} Dữ liệu thống kê
 */

export const getOrders = async (options = {}) => {
  // Chức năng này tương đương với getAllOrders hoặc getUserOrders tùy theo quyền
  // Kiểm tra nếu là admin, sử dụng getAllOrders, nếu không sử dụng getUserOrders
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (isAdmin) {
    return getAllOrders(options);
  } else {
    return getUserOrders();
  }
};

/**
 * Lấy thống kê đơn hàng cho dashboard
 * @returns {Promise<Object>} Dữ liệu thống kê
 */
export const getOrderStatistics = async () => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockOrderStatistics();
    }
    
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};


/**
 * Lấy tất cả đơn hàng của người dùng hiện tại
 * @returns {Promise<Array>} Danh sách đơn hàng
 */
export const getUserOrders = async () => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockUserOrders();
    }
    
    const response = await axios.get(`${API_URL}/my-orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết đơn hàng
 * @param {string} id - ID của đơn hàng
 * @returns {Promise<Object>} Thông tin chi tiết đơn hàng
 */
export const getOrderById = async (id) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockOrderById(id);
    }
    
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Promise<Object>} Đơn hàng đã tạo
 */
export const createOrder = async (orderData) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return createMockOrder(orderData);
    }
    
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái đơn hàng
 * @param {string} id - ID của đơn hàng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} Đơn hàng đã cập nhật
 */
export const updateOrderStatus = async (id, status) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return updateMockOrderStatus(id, status);
    }
    
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

/**
 * Hủy đơn hàng
 * @param {string} id - ID của đơn hàng
 * @returns {Promise<Object>} Kết quả hủy đơn hàng
 */
export const cancelOrder = async (id) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return cancelMockOrder(id);
    }
    
    const response = await axios.post(`${API_URL}/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${id}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả đơn hàng (chỉ dành cho admin)
 * @param {Object} options - Tùy chọn lọc và phân trang
 * @returns {Promise<Object>} Danh sách đơn hàng và thông tin phân trang
 */
export const getAllOrders = async (options = {}) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockAllOrders(options);
    }
    
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    // Xây dựng query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    
    const response = await axios.get(`${API_URL}/admin?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// ------------------- Mock API Functions -------------------

/**
 * Tạo dữ liệu thống kê mock cho dashboard
 * @returns {Promise<Object>}
 */
const getMockOrderStatistics = async () => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Lấy tất cả đơn hàng
  const orders = getMockOrdersData();
  
  // Tính tổng doanh thu
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Đếm số lượng đơn hàng theo trạng thái
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const canceledOrders = orders.filter(order => order.status === 'canceled').length;
  
  // Tính doanh thu theo tháng (6 tháng gần nhất)
  const today = new Date();
  const revenueByMonth = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(today);
    monthDate.setMonth(today.getMonth() - i);
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    
    // Lọc đơn hàng trong tháng này
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === month && orderDate.getFullYear() === year;
    });
    
    // Tính tổng doanh thu trong tháng
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Định dạng tên tháng
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    
    revenueByMonth.push({
      month: `${monthName} ${year}`,
      revenue: Number(monthlyRevenue.toFixed(2))
    });
  }
  
  // Tìm sản phẩm bán chạy nhất
  const productSales = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productSales[item.productId]) {
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      } else {
        productSales[item.productId] = {
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders: orders.length,
    ordersByStatus: {
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      canceled: canceledOrders
    },
    revenueByMonth,
    topProducts,
    conversionRate: 3.2, // Giả định tỷ lệ chuyển đổi là 3.2%
    averageOrderValue: orders.length ? Number((totalRevenue / orders.length).toFixed(2)) : 0
  };
};

/**
 * Trả về danh sách đơn hàng mock của người dùng hiện tại
 * @returns {Promise<Array>}
 */
const getMockUserOrders = async () => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Giả sử user ID của người dùng đang đăng nhập là 2
  const userId = '2'; 
  
  // Lọc đơn hàng theo userId
  return getMockOrdersData().filter(order => order.userId === userId);
};

/**
 * Lấy thông tin chi tiết đơn hàng mock
 * @param {string} id - ID của đơn hàng
 * @returns {Promise<Object>}
 */
const getMockOrderById = async (id) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orders = getMockOrdersData();
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
};

/**
 * Tạo đơn hàng mock mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Promise<Object>}
 */
const createMockOrder = async (orderData) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Tạo ID mới cho đơn hàng
  const newId = String(Date.now());
  
  // Định dạng ngày giờ hiện tại
  const now = new Date().toISOString();
  
  // Tạo đơn hàng mới
  const newOrder = {
    id: newId,
    userId: '2', // ID của người dùng hiện tại
    ...orderData,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };
  
  // Cập nhật danh sách đơn hàng mock
  let orders = getMockOrdersData();
  orders = [newOrder, ...orders];
  
  // Lưu vào localStorage để giữ lại dữ liệu giả lập
  localStorage.setItem('mockOrders', JSON.stringify(orders));
  
  return newOrder;
};

/**
 * Cập nhật trạng thái đơn hàng mock
 * @param {string} id - ID của đơn hàng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>}
 */
const updateMockOrderStatus = async (id, status) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Lấy danh sách đơn hàng mock
  let orders = getMockOrdersData();
  
  // Tìm đơn hàng cần cập nhật
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  // Cập nhật trạng thái
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  // Lưu lại vào localStorage
  localStorage.setItem('mockOrders', JSON.stringify(orders));
  
  return orders[orderIndex];
};

/**
 * Hủy đơn hàng mock
 * @param {string} id - ID của đơn hàng
 * @returns {Promise<Object>}
 */
const cancelMockOrder = async (id) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Lấy danh sách đơn hàng mock
  let orders = getMockOrdersData();
  
  // Tìm đơn hàng cần hủy
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  // Kiểm tra xem đơn hàng có thể hủy không
  if (!['pending', 'processing'].includes(orders[orderIndex].status)) {
    throw new Error('Order cannot be canceled in its current status');
  }
  
  // Cập nhật trạng thái thành 'canceled'
  orders[orderIndex] = {
    ...orders[orderIndex],
    status: 'canceled',
    updatedAt: new Date().toISOString()
  };
  
  // Lưu lại vào localStorage
  localStorage.setItem('mockOrders', JSON.stringify(orders));
  
  return orders[orderIndex];
};

/**
 * Lấy tất cả đơn hàng mock (cho admin)
 * @param {Object} options - Tùy chọn lọc và phân trang
 * @returns {Promise<Object>}
 */
const getMockAllOrders = async (options = {}) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  // Lấy tất cả đơn hàng
  let allOrders = getMockOrdersData();
  
  // Lọc theo trạng thái nếu có
  if (status) {
    allOrders = allOrders.filter(order => order.status === status);
  }
  
  // Sắp xếp
  allOrders.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'total') {
      comparison = a.totalAmount - b.totalAmount;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  // Tính tổng số đơn hàng và tổng số trang
  const totalItems = allOrders.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Phân trang
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit, 10);
  const paginatedOrders = allOrders.slice(startIndex, endIndex);
  
  return {
    orders: paginatedOrders,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalItems,
    totalPages
  };
};

/**
 * Tạo dữ liệu mock cho đơn hàng
 * @returns {Array} Danh sách đơn hàng mock
 */
const getMockOrdersData = () => {
  // Kiểm tra xem đã có dữ liệu trong localStorage chưa
  const savedOrders = localStorage.getItem('mockOrders');
  
  if (savedOrders) {
    return JSON.parse(savedOrders);
  }
  
  // Nếu chưa có, tạo dữ liệu mock mới
  const mockOrders = []
  
  // Lưu vào localStorage
  localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
  
  return mockOrders;
};