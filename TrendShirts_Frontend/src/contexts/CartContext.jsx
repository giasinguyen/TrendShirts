import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

// Custom hook để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Lấy giỏ hàng từ localStorage (nếu có)
  const [cart, setCart] = useState([]); // Khởi tạo cart là mảng rỗng

  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Số lượng sản phẩm trong giỏ hàng
  const [itemCount, setItemCount] = useState(0);
  
  // Tổng giá trị giỏ hàng
  const [total, setTotal] = useState(0);

  // Cập nhật localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Tính toán số lượng sản phẩm
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
    
    // Tính tổng giá trị
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
  }, [items]);

  // Thêm sản phẩm vào giỏ hàng
  const addItem = (item) => {
    setItems(currentItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = currentItems.findIndex(
        existingItem => existingItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        return [...currentItems, item];
      }
    });
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;