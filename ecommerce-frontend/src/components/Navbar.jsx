import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext"; 
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useContext(CartContext); // ⬅️ Usamos el contexto

  return (
    <nav className="navbar">
      <h1 className="logo">UniShop</h1>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li>
          <Link to="/carrito">
            🛒 Carrito {cartCount > 0 && <span>({cartCount})</span>}
          </Link>
        </li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
