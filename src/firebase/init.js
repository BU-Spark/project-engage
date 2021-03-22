import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/performance";
import "firebase/analytics";

const config = {
  apiKey: "AIzaSyCXJTXAGxz8zp7Z_n2f7ljYXg9wbIG4Xgg",
  authDomain: "auth.buspark.app",
  projectId: "spark-project-engage",
  storageBucket: "spark-project-engage.appspot.com",
  messagingSenderId: "95521899365",
  appId: "1:95521899365:web:a63fa08c219e4495f8178c",
  measurementId: "G-NM9Q44FTET"
};

const app = firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();
const db = firebase.firestore();
firebase.performance();
firebase.analytics();

const arrayUnion = array => firebase.firestore.FieldValue.arrayUnion(array);

export default app;
export { auth, functions, db, arrayUnion };
