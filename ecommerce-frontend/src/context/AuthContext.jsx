import React, { createContext, useEffect, useMemo, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const payload = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : ""),
          photoURL: fbUser.photoURL || null,
          provider: fbUser.providerData?.[0]?.providerId || "password",
        };
        setUser(payload);
        try { localStorage.setItem("usuario", JSON.stringify(payload)); } catch {}
      } else {
        setUser(null);
        try { localStorage.removeItem("usuario"); } catch {}
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try { await updateProfile(cred.user, { displayName }); } catch {}
    }
    return cred.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password).then(r => r.user);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    return res.user;
  };

  const logout = () => signOut(auth);

  const adminEmail = (import.meta?.env?.VITE_ADMIN_EMAIL || "").toLowerCase();
  const isAdmin = !!user && (user.email || "").toLowerCase() === adminEmail && adminEmail.length > 0;

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  }), [user, loading, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
