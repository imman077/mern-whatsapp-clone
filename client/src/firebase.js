import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA94MS6JeY_wW7YGSuWKbQKjp-Tbqmp9Ko",
  authDomain: "whatsapp-fed99.firebaseapp.com",
  projectId: "whatsapp-fed99",
  storageBucket: "whatsapp-fed99.firebasestorage.app",
  messagingSenderId: "902542947029",
  appId: "1:902542947029:web:3dac4afbc6bd1f5fe4685c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
export { app, auth, provider };
