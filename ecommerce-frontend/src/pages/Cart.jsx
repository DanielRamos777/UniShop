import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="cart">
      <h2>Tu Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {cart.map((p) => (
            <li key={p.id}>
              <h3>{p.nombre}</h3>
              <p>Precio: S/ {p.precio}</p>
              <p>
                Cantidad:{" "}
                <input
                  type="number"
                  value={p.cantidad}
                  min="1"
                  onChange={(e) => updateQuantity(p.id, parseInt(e.target.value))}
                />
              </p>
              <button onClick={() => removeFromCart(p.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: S/ {total}</h3>
    </div>
  );
}

export default Cart;
