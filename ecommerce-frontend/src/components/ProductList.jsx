import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import "./ProductList.css";

function ProductList() {
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);

  const handleAdd = (product) => {
    if (product.stock <= 0) return;
    addToCart(product);
  };

  return (
    <div className="products">
      <h2>Productos</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>Precio: S/ {p.precio.toFixed(2)}</p>
            <p className={p.stock > 0 ? "stock-ok" : "stock-out"}>Stock: {p.stock}</p>
            <button disabled={p.stock <= 0} onClick={() => handleAdd(p)}>
              {p.stock > 0 ? "Agregar al carrito" : "Sin stock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

