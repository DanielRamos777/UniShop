import { useState } from "react";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const validarEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validarEmail(email)) {
      setError("Email inválido");
      return;
    }
    if (!password) {
      setError("La contraseña no puede estar vacía");
      return;
    }
    const user = { email };
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
    setError("");
  };

  const handleGoogleLogin = () => {
    const user = { email: "googleuser@correo.com" };
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
    setError("");
  };

  return (
    <div className="login-form">
      <h2>Iniciar sesión</h2>
      {usuario ? (
        <p>Bienvenido, {usuario.email}</p>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar sesión</button>
          <button type="button" onClick={handleGoogleLogin}>
            Login con Google
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default LoginForm;