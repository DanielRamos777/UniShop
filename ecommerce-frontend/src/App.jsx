import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import ProductList from "./components/ProductList";
import LoginForm from "./pages/LoginForm";
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<h2>Bienvenido a UniShop</h2>} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
