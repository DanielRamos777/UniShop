import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import ProductList from "./components/ProductList";
import LoginForm from "./pages/LoginForm";
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<h2>Bienvenido a UniShop</h2>} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
