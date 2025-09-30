import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useContext(CartContext);
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
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

