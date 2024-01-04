import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCxGFDGv626YM3Z8ZqBqexSijBEZkTxcM",
  authDomain: "movie-project-90e71.firebaseapp.com",
  projectId: "movie-project-90e71",
  storageBucket: "movie-project-90e71.appspot.com",
  messagingSenderId: "928281739974",
  appId: "1:928281739974:web:1f33213fa0cca9603e8dc7",
  measurementId: "G-56VSBN2MRD",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

export const firebaseDB: Firestore = getFirestore(app);
export const likedMovieRef = collection(firebaseDB, "likedMovie");
