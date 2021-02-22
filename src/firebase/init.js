import firebase from "firebase/app";
const firebaseui = require("firebaseui");
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyCXJTXAGxz8zp7Z_n2f7ljYXg9wbIG4Xgg",
  authDomain: "spark-project-engage.firebaseapp.com",
  projectId: "spark-project-engage",
  storageBucket: "spark-project-engage.appspot.com",
  messagingSenderId: "95521899365",
  appId: "1:95521899365:web:a63fa08c219e4495f8178c",
  measurementId: "G-NM9Q44FTET"
};

const app = firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();

const authUI = new firebaseui.auth.AuthUI(auth);

const authUIConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        prompt: "select_account"
      }
    }
  ]
};

export default app;
export { auth, authUI, authUIConfig, functions };
