import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("usuario", JSON.stringify(user));
    else localStorage.removeItem("usuario");
  }, [user]);

  const login = async (email, password) => {
    // Mock: validación mínima
    if (!email || !password) throw new Error("Completa tus credenciales");
    const u = { email, provider: "password" };
    setUser(u);
    return u;
  };

  const register = async (email, password) => {
    // Mock registro = login
    return login(email, password);
  };

  const loginWithGoogle = async () => {
    const u = {
      email: "googleuser@correo.com",
      name: "Usuario Google",
      provider: "google",
    };
    setUser(u);
    return u;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

