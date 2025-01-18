import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartProductCount, setCartProductCount] = useState(0);

  useEffect(() => {
    // Update cartProductCount whenever the cart changes
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartProductCount(count);
  }, [cart]);

  const fetchCartData = async () => {
    try {
      const cartData = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const existingProduct = cart.find(item => item.productId === product.productId);
      let updatedCart;
      if (existingProduct) {
        updatedCart = cart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
      setCart(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCartData, addToCart, cartProductCount }}>
      {children}
    </CartContext.Provider>
  );
};