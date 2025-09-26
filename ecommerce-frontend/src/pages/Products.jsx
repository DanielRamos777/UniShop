import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Products.css";

function Products() {
  const { addToCart } = useContext(CartContext);

  const productos = [
    { id: 1, nombre: "Laptop Gamer", precio: 3500, stock: 5 },
    { id: 2, nombre: "Smartphone Pro", precio: 2200, stock: 8 },
    { id: 3, nombre: "Audífonos Inalámbricos", precio: 350, stock: 15 },
    { id: 4, nombre: "Mouse RGB", precio: 120, stock: 20 },
  ];

  return (
    <div className="products">
      <h2>Productos Disponibles</h2>
      <div className="product-grid">
        {productos.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.nombre}</h3>
            <p>Precio: S/ {p.precio}</p>
            <p>Stock: {p.stock}</p>
            <button onClick={() => addToCart(p)}>Añadir al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
