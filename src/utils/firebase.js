import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCgJmfIKw1XzMyPlry_tFrzAtHUE_0vQis",
  authDomain: "inv-21.firebaseapp.com",
  projectId: "inv-21",
  storageBucket: "inv-21.firebasestorage.app",
  messagingSenderId: "668998550661",
  appId: "1:668998550661:web:307684d774b28887ffd5ec",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
