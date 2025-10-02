import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ToastContext } from "./ToastContext";

export const CartContext = createContext();

const decodeCart = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readCartFromStorage = (key) => {
  try {
    const fromSession = sessionStorage.getItem(key);
    if (fromSession) return decodeCart(fromSession);
  } catch {
    /* ignore */
  }

  try {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal) return decodeCart(fromLocal);
  } catch {
    /* ignore */
  }

  return [];
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { notify } = useContext(ToastContext);

  const storageKey = useMemo(
    () => (user?.email ? `cart-${user.email}` : "cart-guest"),
    [user?.email]
  );

  const [cart, setCart] = useState(() => readCartFromStorage(storageKey));
  const previousStorageKey = useRef(storageKey);

  useEffect(() => {
    if (previousStorageKey.current !== storageKey) {
      setCart(readCartFromStorage(storageKey));
      previousStorageKey.current = storageKey;
    }
  }, [storageKey]);

  useEffect(() => {
    const payload = JSON.stringify(cart);
    try {
      localStorage.setItem(storageKey, payload);
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.setItem(storageKey, payload);
    } catch {
      /* ignore */
    }
  }, [cart, storageKey]);

  const addToCart = (product) => {
    if (!product) return;
    if (Number(product.stock) <= 0) {
      notify(`"${product.nombre}" no tiene stock disponible.`, { type: "warning" });
      return;
    }

    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        notify(`Cantidad de "${product.nombre}" actualizada en el carrito.`, {
          type: "info",
        });
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      notify(`"${product.nombre}" agregado al carrito.`, { type: "success" });
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const product = prevCart.find((item) => item.id === id);
      if (product) {
        notify(`"${product.nombre}" eliminado del carrito.`, { type: "info" });
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id, cantidad) => {
    const safeValue = Math.max(1, Number(cantidad) || 1);
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, cantidad: safeValue } : item))
    );
  };

  const clearCart = () => {
    if (cart.length > 0) {
      notify("Carrito vaciado", { type: "info" });
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, cartCount, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};


