import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "movie-project",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

export const firebaseDB: Firestore = getFirestore(app);
export const likedMovieRef = collection(firebaseDB, "likedMovie");
