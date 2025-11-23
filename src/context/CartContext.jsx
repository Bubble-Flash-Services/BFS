// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProviderForGreenandClean = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("greenCleanCart") || "[]"
    );
    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("greenCleanCart", JSON.stringify(updatedCart));
  };

  const addToCart = (item) => {
    const exists = cart.find((i) => i.serviceId === item.serviceId);
    const updated = exists
      ? cart.map((i) =>
          i.serviceId === item.serviceId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      : [...cart, item];
    saveCart(updated);
  };

  const removeFromCart = (serviceId) => {
    saveCart(cart.filter((i) => i.serviceId !== serviceId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("greenCleanCart");
  };

  const updateQuantity = (serviceId, qty) => {
    saveCart(
      cart.map((i) => (i.serviceId === serviceId ? { ...i, quantity: qty } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
