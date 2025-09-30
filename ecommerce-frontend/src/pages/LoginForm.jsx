import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./LoginForm.css";

function LoginForm() {
  const { user, login, register, loginWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!validarEmail(email)) return setError("Email inválido");
      await login(email, password);
      setError("");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!validarEmail(email)) return setError("Email inválido");
      await register(email, password);
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
      <h2>Iniciar sesión</h2>
      {user ? (
        <p>Bienvenido, {user.email}</p>
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
          <button type="button" onClick={handleRegister}>Registrarse</button>
          <button type="button" onClick={handleGoogleLogin}>Login con Google</button>
          {error && <p style={{ color: "#ff8080" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default LoginForm;

