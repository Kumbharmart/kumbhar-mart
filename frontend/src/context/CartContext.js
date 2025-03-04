import React, { createContext, useContext, useState, useEffect } from 'react';
import Context from "../context/index";
import SummaryApi from "../common";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { authToken } = useContext(Context); // Get the authToken from Context

    const fetchCartData = async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const responseData = await response.json();
            if (responseData.success) {
                setCart(responseData.data);
            } else {
                console.error("Error in response:", responseData.message);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchCartData(); // Fetch cart data when the component mounts or when authToken changes
        }
    }, [authToken]);

    const addToCart = async (productId) => {
        try {
            const response = await fetch(SummaryApi.addToCartProduct.url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (response.ok) {
                fetchCartData(); // Re-fetch cart data after adding an item
            } else {
                console.error("Failed to add product to cart");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    const cartProductCount = cart.length; // Total quantity of products

    return (
        <CartContext.Provider value={{ cart, fetchCartData, addToCart, cartProductCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

export const calculateTotalQty = (data) => {
    return data
        .filter(product => product.productId && product.productId.quantity > 0 && product.quantity > 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
};
