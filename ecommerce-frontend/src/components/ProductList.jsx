import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import "./ProductList.css";

function ProductList() {
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const priceLimit = maxPrice ? Number(maxPrice) : null;

    return products.filter((product) => {
      const matchesSearch =
        term.length === 0 ||
        product.nombre.toLowerCase().includes(term);
      const matchesPrice =
        priceLimit === null || Number(product.precio) <= priceLimit;
      const matchesAvailability = !onlyAvailable || Number(product.stock) > 0;
      return matchesSearch && matchesPrice && matchesAvailability;
    });
  }, [products, searchTerm, maxPrice, onlyAvailable]);

  const handleAdd = (product) => {
    if (product.stock <= 0) return;
    addToCart(product);
  };

  return (
    <div className="products">
      <h2>Productos</h2>
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Precio maximo"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
        <label className="availability-toggle">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) => setOnlyAvailable(event.target.checked)}
          />
          Solo disponibles
        </label>
      </div>
      {filteredProducts.length === 0 ? (
        <p className="products-empty">No se encontraron productos.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imagen} alt={product.nombre} />
              <h3>{product.nombre}</h3>
              <p>Precio: S/ {product.precio.toFixed(2)}</p>
              <p className={product.stock > 0 ? "stock-ok" : "stock-out"}>Stock: {product.stock}</p>
              <button disabled={product.stock <= 0} onClick={() => handleAdd(product)}>
                {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
