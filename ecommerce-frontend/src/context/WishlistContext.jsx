import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ProductContext } from "./ProductContext";

export const WishlistContext = createContext();

const storageKey = (email) => `wishlist-${email}`;

const parseId = (value) => {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
};

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { products } = useContext(ProductContext);
  const [wishlistIds, setWishlistIds] = useState([]);

  const canManageWishlist = !!user?.email;

  useEffect(() => {
    if (!canManageWishlist) {
      setWishlistIds([]);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey(user.email));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const ids = parsed
            .map((value) => parseId(value))
            .filter((value) => value !== null);
          setWishlistIds(Array.from(new Set(ids)));
          return;
        }
      }
    } catch (error) {
      console.warn("No se pudo leer wishlist desde localStorage", error);
    }

    setWishlistIds([]);
  }, [canManageWishlist, user?.email]);

  useEffect(() => {
    if (!canManageWishlist) return;
    localStorage.setItem(storageKey(user.email), JSON.stringify(wishlistIds));
  }, [canManageWishlist, user?.email, wishlistIds]);

  const wishlist = useMemo(() => {
    if (wishlistIds.length === 0) return [];
    const idSet = new Set(wishlistIds);
    return products.filter((product) => idSet.has(product.id));
  }, [products, wishlistIds]);

  const wishlistCount = wishlistIds.length;

  const isInWishlist = (value) => {
    const id = parseId(value);
    if (id === null) return false;
    return wishlistIds.includes(id);
  };

  const toggleWishlist = (value) => {
    const id = parseId(value);
    if (id === null) return { status: "ignored" };
    if (!canManageWishlist) return { status: "unauthenticated" };

    let status = "added";
    setWishlistIds((prev) => {
      if (prev.includes(id)) {
        status = "removed";
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    return { status };
  };

  const removeFromWishlist = (value) => {
    const id = parseId(value);
    if (id === null) return;
    setWishlistIds((prev) => prev.filter((item) => item !== id));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlist,
        wishlistCount,
        canManageWishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
