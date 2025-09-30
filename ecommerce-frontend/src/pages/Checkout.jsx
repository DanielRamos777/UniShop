import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";
import "./Checkout.css";

const paymentOptions = [
  {
    id: "stripe",
    label: "Tarjeta (Stripe simulado)",
    description: "Ingresa los datos de tarjeta en un entorno seguro simulado.",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Paga con tu cuenta PayPal en un flujo ficticio.",
  },
  {
    id: "yape",
    label: "Yape",
    description: "Transferencia inmediata desde tu celular (referencia simulada).",
  },
];

const emptyForm = {
  nombre: "",
  direccion: "",
  ciudad: "",
  telefono: "",
};

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { decrementStock } = useContext(ProductContext);
  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0),
    [cart]
  );

  const shippingCost = subtotal >= 300 ? 0 : cart.length > 0 ? 25 : 0;
  const totalToPay = subtotal + shippingCost;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const simulatePayment = (selectedOption) => {
    const orderItems = cart.map((item) => ({ ...item }));
    const shippingData = { ...form };
    const orderId = `ORD-${Date.now()}`;
    const reference = `${selectedOption.id.toUpperCase()}-${Math.floor(
      Math.random() * 1_000_000
    )}`;

    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: orderItems,
        subtotal: Number(subtotal.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        total: Number(totalToPay.toFixed(2)),
        userEmail: user?.email || "invitado",
        shipping: shippingData,
        status: "pendiente",
        payment: {
          method: selectedOption.id,
          label: selectedOption.label,
          reference,
          status: "paid",
        },
      };

      storedOrders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(storedOrders));
      setOrder(newOrder);
      orderItems.forEach((item) => decrementStock(item.id, item.cantidad || 1));
      clearCart();
      setForm({ ...emptyForm });
      setPaymentMethod("");
    } catch (err) {
      setError("No se pudo guardar el pedido. Intenta nuevamente.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Tu carrito esta vacio.");
      return;
    }
    if (!paymentMethod) {
      setError("Selecciona un metodo de pago.");
      return;
    }
    if (!form.nombre || !form.direccion || !form.ciudad || !form.telefono) {
      setError("Completa todos los datos de envio.");
      return;
    }

    setProcessing(true);
    setError("");

    const chosen = paymentOptions.find((option) => option.id === paymentMethod);
    if (!chosen) {
      setProcessing(false);
      setError("Metodo de pago no valido.");
      return;
    }

    setTimeout(() => simulatePayment(chosen), 1500);
  };

  if (order) {
    return (
      <div className="checkout checkout-success">
        <h2>Compra exitosa!</h2>
        <p>
          Tu pedido <strong>{order.id}</strong> se pago con {order.payment.label}.
        </p>
        <div className="success-details">
          <p>
            <strong>Referencia de pago:</strong> {order.payment.reference}
          </p>
          <p>
            <strong>Total pagado:</strong> S/ {order.total.toFixed(2)}
          </p>
        </div>
        <div className="success-shipping">
          <h3>Envio a</h3>
          <p>{order.shipping.nombre}</p>
          <p>
            {order.shipping.direccion}, {order.shipping.ciudad}
          </p>
          <p>Tel: {order.shipping.telefono}</p>
        </div>
        <Link className="continue-link" to="/productos">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>Datos de envio</h3>
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
              placeholder="Direccion"
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
              placeholder="Telefono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </section>

          <section className="form-section">
            <h3>Metodo de pago</h3>
            <div className="payment-methods">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`payment-option ${
                    paymentMethod === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>{option.label}</strong>
                    <p>{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {error && <p className="checkout-error">{error}</p>}

          <button
            className="submit-button"
            type="submit"
            disabled={cart.length === 0 || processing}
          >
            {processing
              ? "Procesando pago..."
              : `Pagar S/ ${totalToPay.toFixed(2)}`}
          </button>
        </form>

        <aside className="order-summary">
          <h3>Resumen de pedido</h3>
          {cart.length === 0 ? (
            <p>Tu carrito esta vacio.</p>
          ) : (
            <div className="summary-items">
              {cart.map((p) => (
                <div key={p.id} className="summary-item">
                  <div>
                    <strong>{p.nombre}</strong>
                    <span>Cant. {p.cantidad}</span>
                  </div>
                  <span>S/ {(p.precio * p.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="summary-line">
            <span>Subtotal</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Envio</span>
            <span>{shippingCost === 0 ? "Gratis" : `S/ ${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total a pagar</span>
            <span>S/ {totalToPay.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;

