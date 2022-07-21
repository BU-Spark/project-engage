import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import "firebase/performance";
import "firebase/analytics";

// Config for production database
const config = {
  apiKey: "AIzaSyB46JWorhyNJDzG20J0dujbIY46zNudibc",
  authDomain: "auth.buspark.app",
  projectId: "spark-project-engage",
  storageBucket: "spark-project-engage.appspot.com",
  messagingSenderId: "95521899365",
  appId: "1:95521899365:web:faf942f1ef49f28af8178c",
  measurementId: "G-L9TYR85MP5"
};

// Config for staging database
// const stagingConfig = {
//   apiKey: "AIzaSyCRAkouqVNtyTWclJmg90BxEDIynahqOtM",
//   authDomain: "spark-project-engage-staging.firebaseapp.com",
//   projectId: "spark-project-engage-staging",
//   storageBucket: "spark-project-engage-staging.appspot.com",
//   messagingSenderId: "617899707305",
//   appId: "1:617899707305:web:c98bef1def8c3734ed92b8"
// };

const app = firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();
const db = firebase.firestore();

// If running on localhost, will automatically connect to emulator
if (location.hostname === "localhost") {
  db.useEmulator("localhost", 8081);
}

const storage = firebase.storage();
firebase.performance();
firebase.analytics();
const arrayUnion = array => firebase.firestore.FieldValue.arrayUnion(array);

export default app;
export { app, auth, functions, db, storage, arrayUnion };
