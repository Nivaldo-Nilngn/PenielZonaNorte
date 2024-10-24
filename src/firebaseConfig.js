// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Importa o Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyBVck1yrsM6VglZ40kvlMU9Wg0uHRNd0VY",
    authDomain: "peniel-1abb7.firebaseapp.com",
    projectId: "peniel-1abb7",
    storageBucket: "peniel-1abb7.appspot.com",
    messagingSenderId: "76012438693",
    appId: "1:76012438693:web:4f4c1a7f8900013d76b94c"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // Exporta o banco de dados para ser utilizado