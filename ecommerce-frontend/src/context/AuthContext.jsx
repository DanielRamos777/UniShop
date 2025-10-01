import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: "admin@unishop.com",
  password: "admin123",
  displayName: "Administrador",
};

const profileKey = (email) => `user-profile-${email}`;

const hydrateProfile = (email, data = {}) => {
  if (!email) return null;
  const safeEmail = email.trim().toLowerCase();
  const displayName =
    data.displayName ||
    data.name ||
    (safeEmail ? safeEmail.split("@")[0] : "");
  return {
    email: safeEmail,
    provider: data.provider || "password",
    role: data.role || "customer",
    displayName,
    defaultAddress: data.defaultAddress || null,
    lastLogin: data.lastLogin || new Date().toISOString(),
    lastOrderAt: data.lastOrderAt || null,
  };
};

const loadProfile = (email) => {
  if (!email) return null;
  try {
    const stored = localStorage.getItem(profileKey(email));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistProfile = (profile) => {
  if (!profile?.email) return;
  localStorage.setItem(profileKey(profile.email), JSON.stringify(profile));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("usuario");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      const hydrated = hydrateProfile(parsed.email, parsed);
      if (hydrated) persistProfile(hydrated);
      return hydrated;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("usuario", JSON.stringify(user));
    else localStorage.removeItem("usuario");
  }, [user]);

  const login = async (email, password) => {
    if (!email || !password) throw new Error("Completa tus credenciales");

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    if (
      normalizedEmail === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminProfile = hydrateProfile(normalizedEmail, {
        provider: "password",
        role: "admin",
        displayName: ADMIN_CREDENTIALS.displayName,
        lastLogin: now,
      });
      persistProfile(adminProfile);
      setUser(adminProfile);
      return adminProfile;
    }

    const stored = loadProfile(normalizedEmail);
    const profile = hydrateProfile(normalizedEmail, {
      ...stored,
      provider: "password",
      role: stored?.role || "customer",
      displayName: stored?.displayName || normalizedEmail.split("@")[0],
      defaultAddress: stored?.defaultAddress || null,
      lastOrderAt: stored?.lastOrderAt || null,
      lastLogin: now,
    });
    persistProfile(profile);
    setUser(profile);
    return profile;
  };

  const register = async (email, password) => {
    if (!email || !password) throw new Error("Completa tus credenciales");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email) {
      throw new Error("Ese correo esta reservado para el administrador.");
    }

    const now = new Date().toISOString();
    const profile = hydrateProfile(normalizedEmail, {
      provider: "password",
      role: "customer",
      displayName: normalizedEmail.split("@")[0],
      defaultAddress: null,
      lastLogin: now,
    });
    persistProfile(profile);
    setUser(profile);
    return profile;
  };

  const loginWithGoogle = async () => {
    const email = "googleuser@correo.com";
    const now = new Date().toISOString();
    const stored = loadProfile(email);
    const profile = hydrateProfile(email, {
      ...stored,
      provider: "google",
      role: stored?.role || "customer",
      displayName: stored?.displayName || "Usuario Google",
      defaultAddress: stored?.defaultAddress || null,
      lastOrderAt: stored?.lastOrderAt || null,
      lastLogin: now,
    });
    persistProfile(profile);
    setUser(profile);
    return profile;
  };

  const updateUserProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const profile = hydrateProfile(prev.email, { ...prev, ...updates });
      persistProfile(profile);
      return profile;
    });
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
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
