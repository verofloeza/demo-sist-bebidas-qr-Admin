import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBjwTICiULVyw5ShWChuaKKnBYbMAouEPI",
  authDomain: "fir-sist-bebidas-qr.firebaseapp.com",
  projectId: "fir-sist-bebidas-qr",
  storageBucket: "fir-sist-bebidas-qr.appspot.com",
  messagingSenderId: "179058363028",
  appId: "1:179058363028:web:2ba22575e32e87e7a64281"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };