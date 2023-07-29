// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage, ref } from "firebase/storage";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCFp6L1V87bWSOXqS6Jx-arcpW0Wy9fcI",
  authDomain: "chat-69d37.firebaseapp.com",
  projectId: "chat-69d37",
  storageBucket: "chat-69d37.appspot.com",
  messagingSenderId: "718964875326",
  appId: "1:718964875326:web:5814a023588742eaa4f16f"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()