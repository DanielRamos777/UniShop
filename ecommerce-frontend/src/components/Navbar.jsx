import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">UniShop</div>
      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        ☰
      </button>
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li>
          <Link to="/carrito">
            Carrito
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li><Link to="/perfil">Perfil</Link></li>
            <li>
              <button className="navbar-toggle" aria-label="Cerrar sesión" onClick={logout}>
                Salir {user?.email ? `(${user.email})` : ""}
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

