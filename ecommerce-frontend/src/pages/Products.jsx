import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { CurrencyContext } from "../context/CurrencyContext";
import { CartContext } from "../context/CartContext";
import ProductModal from "../components/ProductModal";
import "../components/ProductList.css";

function Products() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fechaCreacion", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(rows);
      setLoading(false);
    }, (err) => {
      console.error("Error al leer productos:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="products">
      <h2>Productos</h2>
      {loading ? (
        <p>Cargando…</p>
      ) : productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="product-grid">
          {productos.map((p) => (
            <article key={p.id} className="product-mini">
              <div className="product-mini__media">
                <img src={p.imagenUrl || "https://via.placeholder.com/300x200?text=Producto"} alt={p.nombre} />
              </div>
              <div className="product-mini__body">
                <h4 className="product-mini__title">{p.nombre}</h4>
                <p className="product-mini__price">{formatPrice(Number(p.precio || 0))}</p>
              </div>
              <div className="product-mini__actions">
                <button type="button" className="product-mini__more" onClick={() => setSelectedProduct({
                  id: p.id,
                  nombre: p.nombre,
                  descripcion: p.descripcion,
                  precio: Number(p.precio || 0),
                  stock: Number(p.stock || 0),
                  imagen: p.imagenUrl || "https://via.placeholder.com/800x600?text=Producto",
                  imagenes: p.imagenes || (p.imagenUrl ? [p.imagenUrl] : []),
                })}>
                  Ver más
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
}

export default Products;
