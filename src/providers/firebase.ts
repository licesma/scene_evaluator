import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyucQaXUeul6RK4Y3oQG65bRHm-kvC1Mk",
  authDomain: "openreal-1ce24.firebaseapp.com",
  projectId: "openreal-1ce24",
  storageBucket: "openreal-1ce24.firebasestorage.app",
  messagingSenderId: "444902671152",
  appId: "1:444902671152:web:4793900a9684682e23fef5",
  measurementId: "G-HCJ2SH9WG9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
