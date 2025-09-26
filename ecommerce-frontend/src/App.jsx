import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import ProductList from "./pages/ProductList";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<h2>Bienvenido a UniShop</h2>} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/login" element={<h2>Login (pendiente)</h2>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
