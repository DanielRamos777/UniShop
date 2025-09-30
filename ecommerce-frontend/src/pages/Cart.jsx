import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const handleQuantityChange = (id, value) => {
    const parsed = parseInt(value, 10);
    updateQuantity(id, Number.isNaN(parsed) ? 1 : Math.max(1, parsed));
  };

  return (
    <div className="cart">
      <h2>Tu Carrito</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">El carrito esta vacio.</p>
      ) : (
        <>
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
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                    />
                  </label>
                  <button className="remove-button" onClick={() => removeFromCart(p.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <Link className="checkout-link" to="/checkout">
              Continuar al pago
            </Link>
          </div>
        </>
      )}
      <h3 className="cart-total">Total: S/ {total.toFixed(2)}</h3>
    </div>
  );
}

export default Cart;

