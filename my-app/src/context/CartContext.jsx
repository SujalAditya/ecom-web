import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  // Robust token retrieval: from user context or localStorage
  const token = user?.token || localStorage.getItem('token');
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart from backend when token changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setCart([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/cart2`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data);
      } catch {
        setCart([]);
      }
    };
    fetchCart();
  }, [token]);

  // Calculate totals
  useEffect(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    setTotalItems(items);
    setTotalPrice(price);
  }, [cart]);

  // Add item to cart (using new cart2 API)
  const addToCart = async (product, quantity = 1, selectedSize, selectedColor) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await axios.post(`${API_URL}/cart2`, {
        productId: product._id,
        quantity,
        selectedSize,
        selectedColor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${API_URL}/cart2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Add to cart failed' };
    }
  };

  // Update quantity in cart (using new cart2 API)
  const updateQuantity = async (itemId, quantity) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await axios.put(`${API_URL}/cart2/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${API_URL}/cart2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  // Remove item from cart (using new cart2 API)
  const removeFromCart = async (itemId) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      await axios.delete(`${API_URL}/cart2/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${API_URL}/cart2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Remove failed' };
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};