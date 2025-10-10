import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import { analytics } from "./firebase/firebaseConfig";
import LoginForm from "./pages/LoginForm";
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardFB from "./pages/AdminDashboardFB";
import Wishlist from "./pages/Wishlist";

function App() {
  useEffect(() => {
    if (analytics) {
      console.log("Firebase Analytics inicializado:", analytics);
    } else {
      console.log("Firebase Analytics no disponible (faltan credenciales o entorno no compatible)");
    }
  }, []);
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<h2>Bienvenido a UniShop</h2>} />
          <Route path="/productos" element={<Products />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-fb" element={<AdminDashboardFB />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
