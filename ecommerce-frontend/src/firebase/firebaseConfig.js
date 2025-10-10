// Importa Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Configuración provista
const firebaseConfig = {
  apiKey: "AIzaSyApGQRX6Rb37KpOLVxCZHtq0mhcUSZmIok",
  authDomain: "unishop-7be49.firebaseapp.com",
  projectId: "unishop-7be49",
  storageBucket: "unishop-7be49.firebasestorage.app",
  messagingSenderId: "152762142829",
  appId: "1:152762142829:web:62c740a2fbbca01045ef64",
  measurementId: "G-C3GWDEBEX2",
};

// Inicializa Firebase (app, db, storage)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Analytics: solo en producción y si el entorno lo soporta
let analytics = null;
if (import.meta.env.PROD) {
  isSupported()
    .then((yes) => {
      if (yes) {
        try {
          analytics = getAnalytics(app);
          console.log("[firebase] Firebase inicializado (Analytics ACTIVO)");
        } catch (err) {
          console.log("[firebase] Firebase inicializado (Analytics deshabilitado):", err?.message || err);
        }
      } else {
        console.log("[firebase] Firebase inicializado (Analytics deshabilitado: no soportado)");
      }
    })
    .catch((err) => {
      console.log("[firebase] Firebase inicializado (Analytics deshabilitado):", err?.message || err);
    });
} else {
  console.log("[firebase] Firebase inicializado en desarrollo (Analytics deshabilitado)");
}

export { app, db, storage, auth, analytics };
