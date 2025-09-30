import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import "./UserProfile.css";

function UserProfile() {
  const { user, logout } = useContext(AuthContext);

  const allOrders = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      return [];
    }
  }, []);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return allOrders.filter((o) => o.userEmail === user.email);
  }, [allOrders, user]);

  const totalGastado = myOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  if (!user) return <p>Debes iniciar sesion para ver tu perfil.</p>;

  return (
    <div className="user-profile">
      <h2>Perfil de usuario</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <h3>Historial de compras</h3>
      {myOrders.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <ul>
          {myOrders
            .slice()
            .reverse()
            .map((o) => (
              <li key={o.id}>
                <div>
                  <strong>Pedido:</strong> {o.id}
                </div>
                <div>
                  <strong>Fecha:</strong> {new Date(o.date).toLocaleString()}
                </div>
                <div>
                  <strong>Total:</strong> S/ {o.total?.toFixed(2)}
                </div>
                <div>
                  <strong>Estado:</strong> {o.status || "pendiente"}
                </div>
                <details>
                  <summary>Ver productos</summary>
                  <ul>
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.nombre} x {it.cantidad} - S/ {(it.precio * it.cantidad).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
        </ul>
      )}
      <h4>Total gastado: S/ {totalGastado.toFixed(2)}</h4>
      <button onClick={logout}>Cerrar sesion</button>
    </div>
  );
}

export default UserProfile;

