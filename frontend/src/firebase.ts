import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkIrtbj-me4nVQcs-GYLCyegooCxzSlEA",
    authDomain: "studentflow-bdaeb.firebaseapp.com",
    projectId: "studentflow-bdaeb",
    storageBucket: "studentflow-bdaeb.firebasestorage.app",
    messagingSenderId: "754814976286",
    appId: "1:754814976286:web:3277fd44e27f88bb91890f",
    measurementId: "G-B5VTJ8VQFD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
