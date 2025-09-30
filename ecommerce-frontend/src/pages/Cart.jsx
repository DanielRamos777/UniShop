import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="cart">
      <h2>Tu Carrito</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">El carrito está vacío.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((p) => (
            <li key={p.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{p.nombre}</h3>
                <p>Precio: S/ {p.precio.toFixed(2)}</p>
              </div>
              <div className="cart-item-actions">
                <label>
                  Cantidad
                  <input
                    className="quantity-input"
                    type="number"
                    value={p.cantidad}
                    min="1"
                    onChange={(e) =>
                      updateQuantity(p.id, Math.max(1, parseInt(e.target.value)))
                    }
                  />
                </label>
                <button className="remove-button" onClick={() => removeFromCart(p.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3 className="cart-total">Total: S/ {total.toFixed(2)}</h3>
    </div>
  );
}

export default Cart;

