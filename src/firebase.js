// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage, ref } from "firebase/storage";
import { getFirestore} from "firebase/firestore";
import { getDatabase, serverTimestamp  } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4hbrHdq1Sc3Sr45CadVMibNaL-c8sngg",
  authDomain: "chat-f28ad.firebaseapp.com",
  projectId: "chat-f28ad",
  storageBucket: "chat-f28ad.appspot.com",
  messagingSenderId: "681619837127",
  appId: "1:681619837127:web:5f1342532887eb3c78aee2"
};
// Initialize Firebase


export const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()
export const database = getDatabase();

export default  app