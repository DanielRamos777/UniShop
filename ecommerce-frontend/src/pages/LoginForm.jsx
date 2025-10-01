import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { sendSimulatedEmail } from "../utils/emailSimulator";
import "./LoginForm.css";

function LoginForm() {
  const { user, login, register, loginWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!validarEmail(email)) return setError("Email invalido");
      await login(email, password);
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesion");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!validarEmail(email)) return setError("Email invalido");
      const profile = await register(email, password);
      sendSimulatedEmail({
        to: profile.email,
        subject: "Bienvenido a UniShop",
        body: "Hola, gracias por registrarte en UniShop. Tu cuenta esta lista para usar.",
      });
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo registrar");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setError("");
  };

  return (
    <div className="login-form">
      <h2>Iniciar sesion</h2>
      {user ? (
        <p>Bienvenido, {user.displayName || user.email}</p>
      ) : (
        <>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electronico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesion</button>
            <button type="button" onClick={handleRegister}>
              Registrarse
            </button>
            <button type="button" onClick={handleGoogleLogin}>
              Login con Google
            </button>
            {error && <p style={{ color: "#ff8080" }}>{error}</p>}
          </form>
          <p className="admin-hint">
            Acceso admin: <strong>admin@unishop.com</strong> / <strong>admin123</strong>
          </p>
        </>
      )}
    </div>
  );
}

export default LoginForm;
