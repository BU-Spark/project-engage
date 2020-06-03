import firebase from "firebase/app";
const firebaseui = require("firebaseui");
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyCdAklMPvZRewUm0XOX8oYme7CCCgNHcAg",
  authDomain: "project-engage-spark.firebaseapp.com",
  databaseURL: "https://project-engage-spark.firebaseio.com",
  projectId: "project-engage-spark",
  storageBucket: "project-engage-spark.appspot.com",
  messagingSenderId: "946907875873",
  appId: "1:946907875873:web:e1dc8cb8901f5e28827160",
  measurementId: "G-XSD1KGG06J"
};

const app = firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();

const authUI = new firebaseui.auth.AuthUI(auth);

const authUIConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
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
