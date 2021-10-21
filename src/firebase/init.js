import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import "firebase/performance";
import "firebase/analytics";
// import "firebase/document";

const config = {
  apiKey: "AIzaSyB46JWorhyNJDzG20J0dujbIY46zNudibc",
  authDomain: "auth.buspark.app",
  projectId: "spark-project-engage",
  storageBucket: "spark-project-engage.appspot.com",
  messagingSenderId: "95521899365",
  appId: "1:95521899365:web:faf942f1ef49f28af8178c",
  measurementId: "G-L9TYR85MP5"
};

const app = firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();
const db = firebase.firestore();
const storage = firebase.storage();
firebase.performance();
firebase.analytics();
const arrayUnion = array => firebase.firestore.FieldValue.arrayUnion(array);

export default app;
export { app, auth, functions, db, storage, arrayUnion };
