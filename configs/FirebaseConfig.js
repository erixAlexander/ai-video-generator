// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-generator-c1988.firebaseapp.com",
  projectId: "ai-generator-c1988",
  storageBucket: "ai-generator-c1988.firebasestorage.app",
  messagingSenderId: "1082358389376",
  appId: "1:1082358389376:web:03b1078616ef449d086465",
  measurementId: "G-1Z73CJJXYT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
