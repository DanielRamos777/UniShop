import React, { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

const defaultProducts = [
  {
    id: 1,
    nombre: "Laptop Gamer",
    precio: 3500,
    stock: 5,
    imagen: "https://dlcdnwebimgs.asus.com/gain/1387056a-60c6-4579-a3f7-ccf65affd7fa/",
  },
  {
    id: 2,
    nombre: "Auriculares Inalambricos",
    precio: 250,
    stock: 18,
    imagen: "https://pe.tiendasishop.com/cdn/shop/files/JBLT770NCBLKAM.webp?v=1755186506",
  },
  {
    id: 3,
    nombre: "Smartphone",
    precio: 2200,
    stock: 10,
    imagen:
      "https://images.philips.com/is/image/philipsconsumer/d0c4e6ec07484c8eb473b1cb006d08d6?$pnglarge$&wid=960",
  },
  {
    id: 4,
    nombre: "Mouse RGB",
    precio: 120,
    stock: 25,
    imagen:
      "https://promart.vteximg.com.br/arquivos/ids/5813050-1000-1000/image-b16932d868c74242978796ba2205bbcb.jpg?v=637877187998770000",
  },
  {
    id: 5,
    nombre: "Teclado Mecanico",
    precio: 400,
    stock: 12,
    imagen: "https://akl.com.pe/1187-large_default/teclado-mecanico-antryx-xtreme-zigra-blu.jpg",
  },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("products");
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.warn("No se pudo leer products desde localStorage", error);
    }
    return defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => {
      const maxId = prev.reduce((max, item) => Math.max(max, item.id), 0);
      const generatedId = maxId + 1;
      const id = product.id ?? generatedId;
      return [
        ...prev,
        {
          id,
          nombre: product.nombre,
          precio: Number(product.precio),
          stock: Number(product.stock),
          imagen: product.imagen || "https://via.placeholder.com/150",
        },
      ];
    });
  };

  const updateProduct = (id, data) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              precio:
                data.precio !== undefined ? Number(data.precio) : Number(p.precio),
              stock: data.stock !== undefined ? Number(data.stock) : Number(p.stock),
            }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const decrementStock = (id, quantity) => {
    const amount = Math.max(0, Number(quantity) || 0);
    if (!amount) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: Math.max(0, Number(p.stock) - amount) }
          : p
      )
    );
  };

  const setStock = (id, stock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, Number(stock) || 0) } : p
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct, decrementStock, setStock }}
    >
      {children}
    </ProductContext.Provider>
  );
}

