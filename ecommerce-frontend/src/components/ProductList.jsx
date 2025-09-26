import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const productos = [
  { id: 1, nombre: "Laptop Gamer", precio: 3500, imagen: "https://via.placeholder.com/150" },
  { id: 2, nombre: "Auriculares Inalámbricos", precio: 250, imagen: "https://via.placeholder.com/150" },
  { id: 3, nombre: "Smartphone", precio: 2200, imagen: "https://via.placeholder.com/150" },
];

function ProductList() {
  const { addToCart } = useContext(CartContext);

  return (
    <div>
      <h2>Productos</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {productos.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>Precio: S/ {p.precio}</p>
            <button onClick={() => addToCart(p)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
