import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">UniShop</div>
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        ☰
      </button>
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/productos" onClick={() => setMenuOpen(false)}>
            Productos
          </Link>
        </li>
        <li>
          <Link to="/carrito" onClick={() => setMenuOpen(false)}>
            Carrito
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </li>
        )}
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                Perfil
              </Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Salir {user?.email ? `(${user.email})` : ""}
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
