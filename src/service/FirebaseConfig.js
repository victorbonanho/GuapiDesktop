// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5BpNxC7p-ZdOzSy74EuZGvJkGDXNMpGE",
  authDomain: "guapipapes.firebaseapp.com",
  projectId: "guapipapes",
  storageBucket: "guapipapes.appspot.com",
  messagingSenderId: "959422094920",
  appId: "1:959422094920:web:0da81bd01765b56c5f427d",
  measurementId: "G-WML9FRD9EH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);

export { app, auth, storage };
