// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTu426mA1A6OVt5HD9FLhlnJAf_DL3yoU",
  authDomain: "myfinmapp.firebaseapp.com",
  projectId: "myfinmapp",
  storageBucket: "myfinmapp.appspot.com",
  messagingSenderId: "370001867249",
  appId: "1:370001867249:web:afd3a7a55c4ad1297b9450",
  measurementId: "G-222E46K73D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };