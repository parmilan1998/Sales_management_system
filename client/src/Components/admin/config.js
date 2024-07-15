import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDx2f814YiqP7e45bnbTqMbxzp1rYYmwS0",
  authDomain: "sales-e22ef.firebaseapp.com",
  projectId: "sales-e22ef",
  storageBucket: "sales-e22ef.appspot.com",
  messagingSenderId: "729803062523",
  appId: "1:729803062523:web:5fc2d0a9e95b48a0fbc45e",
  measurementId: "G-9ZVXSDH7N7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
