// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ3smGZI715cEBws6bD-DDjhhePQ9o5mc",
  authDomain: "newera-87968.firebaseapp.com",
  projectId: "newera-87968",
  storageBucket: "newera-87968.firebasestorage.app",
  messagingSenderId: "405040555192",
  appId: "1:405040555192:web:64338d9f2e334d8c86004d",
  measurementId: "G-EZ7CPJYEPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;