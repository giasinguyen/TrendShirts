import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProducts } from '../services/productService';

const ProductContext = createContext();

// Custom hook để sử dụng ProductContext
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  // Lấy dữ liệu sản phẩm khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products || []);
        
        // Lọc sản phẩm nổi bật
        if (data.products) {
          const featured = data.products.filter(product => product.featured);
          setFeaturedProducts(featured);
          
          // Lấy sản phẩm mới nhất
          const sortedByDate = [...data.products].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNewArrivals(sortedByDate.slice(0, 8));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm lấy sản phẩm theo danh mục
  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.category?.id === categoryId);
  };

  // Hàm tìm kiếm sản phẩm
  const searchProducts = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        featuredProducts,
        newArrivals,
        getProductsByCategory,
        searchProducts,
        refreshProducts: () => {
          setLoading(true);
          getProducts()
            .then((data) => {
              setProducts(data.products || []);
              const featured = data.products.filter(product => product.featured);
              setFeaturedProducts(featured);
              
              const sortedByDate = [...data.products].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              setNewArrivals(sortedByDate.slice(0, 8));
              
              setError(null);
            })
            .catch((err) => {
              console.error('Error refreshing products:', err);
              setError('Failed to refresh products');
            })
            .finally(() => {
              setLoading(false);
            });
        },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;