import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory as deleteCategory_Service } from '../services/categoryService';

const CategoryContext = createContext();

// Custom hook để sử dụng CategoryContext
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách danh mục khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm thêm danh mục mới
  const addCategory = async (categoryData) => {
    try {
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  // Hàm cập nhật danh mục
  const updateCategoryItem = async (id, categoryData) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      setCategories(
        categories.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // Hàm xóa danh mục
  const deleteCategory = async (id) => {
    try {
      await deleteCategory_Service(id);
      setCategories(categories.filter((category) => category.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // Hàm lấy danh mục theo id
  const getCategoryById = (id) => {
    return categories.find((category) => category.id === id) || null;
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory: updateCategoryItem,
        deleteCategory,
        getCategoryById,
        refreshCategories: () => {
          setLoading(true);
          getCategories()
            .then((data) => {
              setCategories(data);
              setError(null);
            })
            .catch((err) => {
              console.error('Error refreshing categories:', err);
              setError('Failed to refresh categories');
            })
            .finally(() => {
              setLoading(false);
            });
        },
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;