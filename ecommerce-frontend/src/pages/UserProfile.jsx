import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./UserProfile.css";

function UserProfile() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const { cart } = useContext(CartContext);

  // Simulación de historial: los productos actuales del carrito
  const historial = cart;
  const total = historial.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  if (!usuario) {
    return <p>Debes iniciar sesión para ver tu perfil.</p>;
  }

  return (
    <div className="user-profile">
      <h2>Perfil de usuario</h2>
      <p><strong>Email:</strong> {usuario.email}</p>
      <h3>Historial de compras</h3>
      {historial.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <ul>
          {historial.map((p) => (
            <li key={p.id}>
              {p.nombre} x {p.cantidad} — S/ {p.precio * p.cantidad}
            </li>
          ))}
        </ul>
      )}
      <h4>Total gastado: S/ {total}</h4>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default UserProfile;