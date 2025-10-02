import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <section className="footer-section">
            <div className="footer-brand">© {year} UniShop</div>
            <p className="footer-tagline">Tecnología al alcance de todos.</p>
          </section>
          <section className="footer-section">
            <h4 className="footer-title">Enlaces</h4>
            <nav className="footer-links" aria-label="Enlaces rápidos">
              <Link to="/">Home</Link>
              <Link to="/productos">Productos</Link>
              <a href="#contacto">Contacto</a>
            </nav>
          </section>
          <section id="contacto" className="footer-section">
            <h4 className="footer-title">Contacto</h4>
            <ul className="footer-list">
              <li>
                <a href="mailto:soporte@unishop.com">soporte@unishop.com</a>
              </li>
              <li>
                <a href="tel:+51999999999">+51 999 999 999</a>
              </li>
              <li>Lima, Perú</li>
            </ul>
          </section>
          <section className="footer-section">
            <h4 className="footer-title">Suscríbete</h4>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Gracias por suscribirte a las novedades de UniShop!");
              }}
            >
              <input type="email" placeholder="Tu correo" aria-label="Correo para suscripción" />
              <button type="submit">Suscribirme</button>
            </form>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Fb</a>
              <a href="#" aria-label="Instagram">Ig</a>
              <a href="#" aria-label="Twitter">Tw</a>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
