import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Leer carrito desde localStorage al iniciar
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 1. Agregar producto y aumentar cantidad si ya existe
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, cantidad: 1 }];
      }
    });
  };

  // 2. Contador total de productos en el carrito
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // 3. Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 4. Actualizar cantidad de un producto
  const updateQuantity = (id, cantidad) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  // 5. Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        cartCount,
        removeFromCart,
        updateQuantity,
        clearCart, //  ahora está disponible en el contexto
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
