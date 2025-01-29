// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importamos getAuth para la autenticación
import { getFirestore } from 'firebase/firestore'; // Si necesitas Firestore en el futuro

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDyZGZoxRmnw6LddzFFsLTC-2eeuyoBCM",
  authDomain: "reactnative-ee4ec.firebaseapp.com",
  projectId: "reactnative-ee4ec",
  storageBucket: "reactnative-ee4ec.firebasestorage.app",
  messagingSenderId: "480861698555",
  appId: "1:480861698555:web:fa7fdc9984a31d1b1d335e",
  measurementId: "G-9LYDG711B0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias que utilizarás en otras partes de la aplicación
export const auth = getAuth(app); // Autenticación
export const db = getFirestore(app); // Base de datos Firestore (si la usas en el futuro)
// 