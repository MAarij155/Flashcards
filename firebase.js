// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkDLrjtKCJ_kzyOGWqmUc51_I75Hent2g",
  authDomain: "flashcardsaas-baed0.firebaseapp.com",
  projectId: "flashcardsaas-baed0",
  storageBucket: "flashcardsaas-baed0.appspot.com",
  messagingSenderId: "485564435337",
  appId: "1:485564435337:web:6b4cd0afa6849438d4af58",
  measurementId: "G-LGBT3HY10G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}