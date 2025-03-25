import axios from 'axios';

const API_URL = '/api/products';

/**
 * Lấy danh sách sản phẩm với các tùy chọn lọc
 * @param {Object} options - Các tùy chọn lọc
 * @returns {Promise<Object>} Dữ liệu sản phẩm và thông tin phân trang
 */
/**
 * Lấy danh sách sản phẩm với các tùy chọn lọc
 * @param {Object} options - Các tùy chọn lọc
 * @returns {Promise<Object>} Dữ liệu sản phẩm và thông tin phân trang
 */
export const getProducts = async (options = {}) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockProducts(options);
    }
    
    const { page = 1, limit = 10, category, sort, search, minPrice, maxPrice } = options;
    
    // Xây dựng query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Alias để tương thích với các component hiện tại
export const getAllProducts = getProducts;


/**
 * Lấy sản phẩm theo ID
 * @param {string} id - ID của sản phẩm
 * @returns {Promise<Object>} Thông tin sản phẩm
 */
export const getProductById = async (id) => {
  try {
    // Kiểm tra nếu đang sử dụng mock API
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockProductById(id);
    }
    
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo sản phẩm mới
 * @param {Object} productData - Dữ liệu sản phẩm
 * @returns {Promise<Object>} Sản phẩm vừa tạo
 */
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};



/**
 * Cập nhật sản phẩm
 * @param {string} id - ID của sản phẩm
 * @param {Object} productData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Sản phẩm đã cập nhật
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa sản phẩm
 * @param {string} id - ID của sản phẩm
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};


/**
 * Trả về dữ liệu mock cho sản phẩm khi không có backend
 * @param {Object} options - Các tùy chọn lọc
 * @returns {Promise<Object>}
 */
const getMockProducts = async (options = {}) => {
  const { page = 1, limit = 10, category, sort, search, minPrice, maxPrice } = options;
  
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Tạo danh sách sản phẩm mock
  let allProducts = getMockProductsData();
  
  // Áp dụng bộ lọc
  if (category) {
    allProducts = allProducts.filter(product => 
      product.category && product.category.slug === category
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    allProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  }
  
  if (minPrice) {
    allProducts = allProducts.filter(product => product.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    allProducts = allProducts.filter(product => product.price <= parseFloat(maxPrice));
  }
  
  // Sắp xếp
  if (sort) {
    switch (sort) {
      case 'price_asc':
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        allProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
  }
  
  // Tính tổng số sản phẩm và tổng số trang
  const totalItems = allProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Phân trang
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedProducts = allProducts.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    page: parseInt(page),
    limit: parseInt(limit),
    totalItems,
    totalPages
  };
};

/**
 * Lấy sản phẩm mock theo ID
 * @param {string} id - ID của sản phẩm
 * @returns {Promise<Object>}
 */
const getMockProductById = async (id) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const products = getMockProductsData();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

/**
 * Tạo dữ liệu mock cho sản phẩm
 * @returns {Array} Danh sách sản phẩm
 */
const getMockProductsData = () => {
  return [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      slug: 'classic-white-t-shirt',
      description: 'A comfortable white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
      price: 19.99,
      oldPrice: 24.99,
      discount: 20,
      sku: 'TS-WH-01',
      quantity: 100,
      featured: true,
      category: {
        id: '1',
        name: 'Men',
        slug: 'men'
      },
      colors: ['White', 'Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://via.placeholder.com/600x800?text=White+T-Shirt+1',
        'https://via.placeholder.com/600x800?text=White+T-Shirt+2',
        'https://via.placeholder.com/600x800?text=White+T-Shirt+3'
      ],
      tags: ['t-shirt', 'casual', 'cotton'],
      features: [
        '100% organic cotton',
        'Comfortable fit',
        'Machine washable',
        'Eco-friendly dye'
      ],
      createdAt: '2023-01-15T00:00:00.000Z',
      updatedAt: '2023-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Slim Fit Jeans',
      slug: 'slim-fit-jeans',
      description: 'Stylish slim fit jeans with a modern design. Made from high-quality denim for durability.',
      price: 49.99,
      oldPrice: null,
      discount: 0,
      sku: 'JN-SF-02',
      quantity: 75,
      featured: true,
      category: {
        id: '1',
        name: 'Men',
        slug: 'men'
      },
      colors: ['Blue', 'Black', 'Gray'],
      sizes: ['30', '32', '34', '36'],
      images: [
        'https://via.placeholder.com/600x800?text=Slim+Fit+Jeans+1',
        'https://via.placeholder.com/600x800?text=Slim+Fit+Jeans+2'
      ],
      tags: ['jeans', 'denim', 'slim fit'],
      features: [
        'High-quality denim',
        'Slim fit design',
        'Reinforced stitching',
        'Multiple pockets'
      ],
      createdAt: '2023-02-10T00:00:00.000Z',
      updatedAt: '2023-02-10T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Summer Floral Dress',
      slug: 'summer-floral-dress',
      description: 'Light and airy floral dress perfect for summer days. Features a flattering cut and breathable fabric.',
      price: 39.99,
      oldPrice: 59.99,
      discount: 33,
      sku: 'DR-FL-03',
      quantity: 50,
      featured: true,
      category: {
        id: '2',
        name: 'Women',
        slug: 'women'
      },
      colors: ['Red Floral', 'Blue Floral'],
      sizes: ['XS', 'S', 'M', 'L'],
      images: [
        'https://via.placeholder.com/600x800?text=Floral+Dress+1',
        'https://via.placeholder.com/600x800?text=Floral+Dress+2',
        'https://via.placeholder.com/600x800?text=Floral+Dress+3'
      ],
      tags: ['dress', 'summer', 'floral'],
      features: [
        'Lightweight fabric',
        'Adjustable straps',
        'Lined bodice',
        'Machine washable'
      ],
      createdAt: '2023-03-05T00:00:00.000Z',
      updatedAt: '2023-03-05T00:00:00.000Z'
    },
    // Thêm 7 sản phẩm nữa để có đủ 10 sản phẩm
    {
      id: '4',
      name: 'Athletic Running Shoes',
      slug: 'athletic-running-shoes',
      description: 'Comfortable running shoes with advanced cushioning and support. Perfect for athletes and casual runners.',
      price: 89.99,
      oldPrice: 119.99,
      discount: 25,
      sku: 'SH-RN-04',
      quantity: 60,
      featured: false,
      category: {
        id: '5',
        name: 'Sport',
        slug: 'sport'
      },
      colors: ['Black/Red', 'Blue/White', 'Gray/Yellow'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      images: [
        'https://via.placeholder.com/600x800?text=Running+Shoes+1',
        'https://via.placeholder.com/600x800?text=Running+Shoes+2'
      ],
      tags: ['shoes', 'running', 'athletic'],
      features: [
        'Lightweight design',
        'Memory foam insole',
        'Breathable mesh upper',
        'Non-slip rubber sole'
      ],
      createdAt: '2023-02-25T00:00:00.000Z',
      updatedAt: '2023-02-25T00:00:00.000Z'
    },
    {
      id: '5',
      name: 'Kids Cartoon T-Shirt',
      slug: 'kids-cartoon-t-shirt',
      description: 'Fun and colorful cartoon print t-shirt for kids. Made from soft cotton that is gentle on skin.',
      price: 14.99,
      oldPrice: null,
      discount: 0,
      sku: 'KD-TS-05',
      quantity: 120,
      featured: false,
      category: {
        id: '3',
        name: 'Kids',
        slug: 'kids'
      },
      colors: ['Red', 'Blue', 'Yellow'],
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
      images: [
        'https://via.placeholder.com/600x800?text=Kids+Shirt+1',
        'https://via.placeholder.com/600x800?text=Kids+Shirt+2'
      ],
      tags: ['kids', 't-shirt', 'cartoon'],
      features: [
        'Soft cotton fabric',
        'Vibrant colors',
        'Machine washable',
        'Non-irritating neckline'
      ],
      createdAt: '2023-04-12T00:00:00.000Z',
      updatedAt: '2023-04-12T00:00:00.000Z'
    },
    {
      id: '6',
      name: 'Leather Crossbody Bag',
      slug: 'leather-crossbody-bag',
      description: 'Elegant leather crossbody bag with multiple compartments. Perfect for everyday use and special occasions.',
      price: 79.99,
      oldPrice: 99.99,
      discount: 20,
      sku: 'BG-CB-06',
      quantity: 40,
      featured: true,
      category: {
        id: '4',
        name: 'Accessories',
        slug: 'accessories'
      },
      colors: ['Black', 'Brown', 'Tan'],
      sizes: ['One Size'],
      images: [
        'https://via.placeholder.com/600x800?text=Leather+Bag+1',
        'https://via.placeholder.com/600x800?text=Leather+Bag+2',
        'https://via.placeholder.com/600x800?text=Leather+Bag+3'
      ],
      tags: ['bag', 'leather', 'accessory'],
      features: [
        'Genuine leather',
        'Adjustable strap',
        'Multiple compartments',
        'Secure zipper closure'
      ],
      createdAt: '2023-01-30T00:00:00.000Z',
      updatedAt: '2023-01-30T00:00:00.000Z'
    },
    {
      id: '7',
      name: 'Women\'s Yoga Pants',
      slug: 'womens-yoga-pants',
      description: 'Stretchy and comfortable yoga pants with high waist design. Perfect for yoga, gym, or casual wear.',
      price: 34.99,
      oldPrice: null,
      discount: 0,
      sku: 'YG-PT-07',
      quantity: 85,
      featured: false,
      category: {
        id: '5',
        name: 'Sport',
        slug: 'sport'
      },
      colors: ['Black', 'Navy', 'Purple'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: [
        'https://via.placeholder.com/600x800?text=Yoga+Pants+1',
        'https://via.placeholder.com/600x800?text=Yoga+Pants+2'
      ],
      tags: ['yoga', 'pants', 'athletic', 'women'],
      features: [
        'Four-way stretch fabric',
        'High waist design',
        'Hidden pocket',
        'Moisture-wicking'
      ],
      createdAt: '2023-05-10T00:00:00.000Z',
      updatedAt: '2023-05-10T00:00:00.000Z'
    },
    {
      id: '8',
      name: 'Men\'s Business Suit',
      slug: 'mens-business-suit',
      description: 'Classic business suit for men with modern slim fit. Perfect for formal occasions and business meetings.',
      price: 199.99,
      oldPrice: 249.99,
      discount: 20,
      sku: 'ST-BZ-08',
      quantity: 30,
      featured: true,
      category: {
        id: '1',
        name: 'Men',
        slug: 'men'
      },
      colors: ['Navy', 'Charcoal', 'Black'],
      sizes: ['38', '40', '42', '44', '46'],
      images: [
        'https://via.placeholder.com/600x800?text=Business+Suit+1',
        'https://via.placeholder.com/600x800?text=Business+Suit+2'
      ],
      tags: ['suit', 'formal', 'business'],
      features: [
        'Premium fabric',
        'Modern slim fit',
        'Fully lined',
        'Inner pockets'
      ],
      createdAt: '2023-03-20T00:00:00.000Z',
      updatedAt: '2023-03-20T00:00:00.000Z'
    },
    {
      id: '9',
      name: 'Winter Knit Beanie',
      slug: 'winter-knit-beanie',
      description: 'Warm knit beanie for cold winter days. Made from soft acrylic yarn with fleece lining for extra warmth.',
      price: 12.99,
      oldPrice: 17.99,
      discount: 28,
      sku: 'HT-BN-09',
      quantity: 150,
      featured: false,
      category: {
        id: '4',
        name: 'Accessories',
        slug: 'accessories'
      },
      colors: ['Black', 'Gray', 'Red', 'Blue'],
      sizes: ['One Size'],
      images: [
        'https://via.placeholder.com/600x800?text=Knit+Beanie+1',
        'https://via.placeholder.com/600x800?text=Knit+Beanie+2'
      ],
      tags: ['hat', 'beanie', 'winter', 'accessory'],
      features: [
        'Soft acrylic yarn',
        'Fleece lining',
        'Stretchable fit',
        'Double-layer knit'
      ],
      createdAt: '2023-06-05T00:00:00.000Z',
      updatedAt: '2023-06-05T00:00:00.000Z'
    },
    {
      id: '10',
      name: 'Kids Denim Overalls',
      slug: 'kids-denim-overalls',
      description: 'Cute and durable denim overalls for kids. Features adjustable straps and multiple pockets.',
      price: 29.99,
      oldPrice: 39.99,
      discount: 25,
      sku: 'KD-OV-10',
      quantity: 65,
      featured: false,
      category: {
        id: '3',
        name: 'Kids',
        slug: 'kids'
      },
      colors: ['Blue', 'Light Blue'],
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
      images: [
        'https://via.placeholder.com/600x800?text=Kids+Overalls+1',
        'https://via.placeholder.com/600x800?text=Kids+Overalls+2'
      ],
      tags: ['kids', 'denim', 'overalls'],
      features: [
        'Soft denim fabric',
        'Adjustable straps',
        'Multiple pockets',
        'Reinforced knees'
      ],
      createdAt: '2023-04-28T00:00:00.000Z',
      updatedAt: '2023-04-28T00:00:00.000Z'
    }
  ];
};