import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} UniShop. Todos los derechos reservados.</p>
      <p>Hecho con ❤️ en React</p>
    </footer>
  );
}

export default Footer;
