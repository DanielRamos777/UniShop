import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: "admin@unishop.com",
  password: "admin123",
  name: "Administrador",
};

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
    if (!email || !password) throw new Error("Completa tus credenciales");

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser = {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        provider: "password",
        role: "admin",
      };
      setUser(adminUser);
      return adminUser;
    }

    const regularUser = {
      email: normalizedEmail,
      provider: "password",
      role: "customer",
    };
    setUser(regularUser);
    return regularUser;
  };

  const register = async (email, password) => {
    if (!email || !password) throw new Error("Completa tus credenciales");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email) {
      throw new Error("Ese correo esta reservado para el administrador.");
    }

    const newUser = {
      email: normalizedEmail,
      provider: "password",
      role: "customer",
    };
    setUser(newUser);
    return newUser;
  };

  const loginWithGoogle = async () => {
    const u = {
      email: "googleuser@correo.com",
      name: "Usuario Google",
      provider: "google",
      role: "customer",
    };
    setUser(u);
    return u;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

