import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    telefono: "",
  });
  const [exito, setExito] = useState(false);

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula éxito de compra
    setExito(true);
    clearCart(); // Limpia el carrito desde el contexto
  };

  if (exito) {
    return (
      <div className="checkout checkout-success">
        <h2>¡Compra exitosa!</h2>
        <p>Gracias por tu pedido.</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <h3>Resumen del carrito</h3>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <ul>
          {cart.map((p) => (
            <li key={p.id}>
              {p.nombre} x {p.cantidad} — S/ {(p.precio * p.cantidad).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <h4>Total: S/ {total.toFixed(2)}</h4>
      <h3>Dirección de envío</h3>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
        <button className="submit-button" type="submit" disabled={cart.length === 0}>
          Pagar
        </button>
      </form>
    </div>
  );
}

export default Checkout;

