// Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa8ISWH_61S_4w5Lyu50le8jaU0U0r44s",
  authDomain: "test-f27bd.firebaseapp.com",
  projectId: "test-f27bd",
  storageBucket: "test-f27bd.firebasestorage.app",
  messagingSenderId: "365836331375",
  appId: "1:365836331375:web:4e604f278e52c18282e09a",
  measurementId: "G-P7HXBQX71X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
