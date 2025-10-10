import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CurrencyContext } from "./CurrencyContext";

export const ProductContext = createContext();

const defaultProducts = [
  {
    id: 1,
    nombre: "Laptop Gamer",
    precio: 3500,
    stock: 5,
    categoria: "Computadoras",
    etiquetas: ["gaming", "alto rendimiento"],
    descripcion: "Laptop para juegos exigentes con grafica dedicada y pantalla de 144 Hz.",
    imagen: "https://dlcdnwebimgs.asus.com/gain/1387056a-60c6-4579-a3f7-ccf65affd7fa/",
  },
  {
    id: 2,
    nombre: "Auriculares Inalambricos",
    precio: 250,
    stock: 18,
    categoria: "Audio",
    etiquetas: ["inalambrico", "bluetooth"],
    descripcion: "Auriculares con cancelacion pasiva de ruido y 30 horas de bateria.",
    imagen: "https://pe.tiendasishop.com/cdn/shop/files/JBLT770NCBLKAM.webp?v=1755186506",
  },
  {
    id: 3,
    nombre: "Smartphone Pro",
    precio: 2200,
    stock: 10,
    categoria: "Celulares",
    etiquetas: ["android", "alta gama"],
    descripcion: "Pantalla AMOLED, 256 GB de almacenamiento y camara triple.",
    imagen: "https://images.philips.com/is/image/philipsconsumer/d0c4e6ec07484c8eb473b1cb006d08d6?$pnglarge$&wid=960",
  },
  {
    id: 4,
    nombre: "Mouse RGB",
    precio: 120,
    stock: 25,
    categoria: "Accesorios",
    etiquetas: ["gaming", "rgb"],
    descripcion: "Sensor de 12 000 DPI y efectos de iluminacion personalizables.",
    imagen: "https://promart.vteximg.com.br/arquivos/ids/5813050-1000-1000/image-b16932d868c74242978796ba2205bbcb.jpg?v=637877187998770000",
  },
  {
    id: 5,
    nombre: "Teclado Mecanico",
    precio: 400,
    stock: 12,
    categoria: "Accesorios",
    etiquetas: ["mecanico", "rgb"],
    descripcion: "Interruptores blue y estructura de aluminio con apoyo para muneca.",
    imagen: "https://akl.com.pe/1187-large_default/teclado-mecanico-antryx-xtreme-zigra-blu.jpg",
  },
  {
    id: 6,
    nombre: "Monitor 27 Pulgadas",
    precio: 950,
    stock: 7,
    categoria: "Monitores",
    etiquetas: ["144hz", "hdr"],
    descripcion: "Monitor IPS con resolucion 2K ideal para trabajo y juego.",
    imagen: "https://m.media-amazon.com/images/I/71wMLqmQN3L._AC_SL1500_.jpg",
  },
  {
    id: 7,
    nombre: "Silla Ergonomica",
    precio: 650,
    stock: 9,
    categoria: "Muebles",
    etiquetas: ["ergonomia", "oficina"],
    descripcion: "Silla con soporte lumbar ajustable y espuma de alta densidad.",
    imagen: "https://m.media-amazon.com/images/I/71dK46z9dML._AC_SL1500_.jpg",
  },
  {
    id: 8,
    nombre: "Disco SSD 1TB",
    precio: 480,
    stock: 16,
    categoria: "Almacenamiento",
    etiquetas: ["ssd", "rapido"],
    descripcion: "Unidad NVMe con velocidades de lectura de hasta 3 500 MB por segundo.",
    imagen: "https://m.media-amazon.com/images/I/71S+o+ky8wL._AC_SL1500_.jpg",
  },
];

const normalizeTags = (value) => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.toString().split(",");
  const clean = list
    .map((tag) => tag.toString().trim())
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(clean));
};

const normalizeProduct = (product) => {
  const id = Number(product.id);
  const precio = Number(product.precio);
  const stock = Number(product.stock);
  const imageList = Array.isArray(product.imagenes)
    ? product.imagenes
        .map((u) => (u ? u.toString().trim() : ""))
        .filter((u) => u.length > 0)
    : (product.imagen ? [product.imagen] : []);
  const safeImages = imageList.length > 0 ? imageList : ["https://via.placeholder.com/800x600?text=Producto"];
  return {
    id: Number.isFinite(id) ? id : Date.now(),
    nombre: product.nombre?.toString().trim() || "Producto sin nombre",
    precio: Number.isFinite(precio) ? precio : 0,
    stock: Number.isFinite(stock) ? stock : 0,
    imagen: (product.imagen || safeImages[0] || "https://via.placeholder.com/150"),
    imagenes: safeImages,
    categoria: product.categoria?.toString().trim() || "General",
    etiquetas: normalizeTags(product.etiquetas),
    descripcion: product.descripcion?.toString().trim() || "",
  };
};

const initialFilters = {
  searchTerm: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  tags: [],
  onlyAvailable: false,
};

export function ProductProvider({ children }) {
  const { currency, convert, baseCurrency } = useContext(CurrencyContext);

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => normalizeProduct(item));
        }
      }
    } catch (error) {
      console.warn("No se pudo leer products desde localStorage", error);
    }
    return defaultProducts.map((item) => normalizeProduct(item));
  });

  const [filters, setFilters] = useState(() => {
    try {
      const stored = sessionStorage.getItem("productFilters");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialFilters, ...parsed, tags: normalizeTags(parsed.tags) };
      }
    } catch {
      /* ignore */
    }
    return { ...initialFilters };
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    try {
      sessionStorage.setItem("productFilters", JSON.stringify(filters));
    } catch {
      /* ignore write errors */
    }
  }, [filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: "",
      maxPrice: "",
    }));
  }, [currency]);

  const availableCategories = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product.categoria) unique.add(product.categoria);
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const availableTags = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      product.etiquetas.forEach((tag) => {
        if (tag) unique.add(tag);
      });
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = filters.searchTerm.trim().toLowerCase();
    const hasMin = filters.minPrice !== "" && Number.isFinite(Number(filters.minPrice));
    const hasMax = filters.maxPrice !== "" && Number.isFinite(Number(filters.maxPrice));
    const min = hasMin
      ? convert(Number(filters.minPrice), currency, baseCurrency)
      : null;
    const max = hasMax
      ? convert(Number(filters.maxPrice), currency, baseCurrency)
      : null;
    const activeTags = filters.tags.map((tag) => tag.toLowerCase());

    return products.filter((product) => {
      const matchesSearch =
        term.length === 0 ||
        product.nombre.toLowerCase().includes(term) ||
        product.categoria.toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (filters.category !== "all" && product.categoria !== filters.category) return false;
      if (min !== null && product.precio < min) return false;
      if (max !== null && product.precio > max) return false;
      if (filters.onlyAvailable && product.stock <= 0) return false;
      if (
        activeTags.length > 0 &&
        !activeTags.every((tag) =>
          product.etiquetas.some((item) => item.toLowerCase() === tag)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [products, filters, convert, currency, baseCurrency]);

  const updateFilters = (updates) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      if (updates.tags !== undefined) {
        next.tags = normalizeTags(next.tags);
      }
      if (updates.searchTerm !== undefined) {
        next.searchTerm = updates.searchTerm;
      }
      if (updates.minPrice !== undefined && updates.minPrice === "") {
        next.minPrice = "";
      }
      if (updates.maxPrice !== undefined && updates.maxPrice === "") {
        next.maxPrice = "";
      }
      return next;
    });
  };

  const toggleTagFilter = (tag) => {
    setFilters((prev) => {
      if (!tag) return prev;
      const value = tag.toString().trim();
      if (!value) return prev;
      const exists = prev.tags.some((item) => item.toLowerCase() === value.toLowerCase());
      if (exists) {
        return {
          ...prev,
          tags: prev.tags.filter((item) => item.toLowerCase() !== value.toLowerCase()),
        };
      }
      return {
        ...prev,
        tags: [...prev.tags, value],
      };
    });
  };

  const resetFilters = () => setFilters({ ...initialFilters });

  const addProduct = (product) => {
    setProducts((prev) => {
      const maxId = prev.reduce((maxValue, item) => Math.max(maxValue, item.id), 0);
      const payload = { ...product, id: product.id ?? maxId + 1 };
      return [...prev, normalizeProduct(payload)];
    });
  };

  const updateProduct = (id, data) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? normalizeProduct({ ...product, ...data, id }) : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const decrementStock = (id, quantity) => {
    const amount = Math.max(0, Number(quantity) || 0);
    if (!amount) return;
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, stock: Math.max(0, product.stock - amount) }
          : product
      )
    );
  };

  const setStock = (id, stock) => {
    const nextStock = Math.max(0, Number(stock) || 0);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, stock: nextStock } : product
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        updateFilters,
        resetFilters,
        toggleTagFilter,
        availableCategories,
        availableTags,
        addProduct,
        updateProduct,
        removeProduct,
        decrementStock,
        setStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
