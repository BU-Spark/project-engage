import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import "firebase/auth";

Vue.config.productionTip = false;

var app = null;
firebase.auth().onAuthStateChanged(async () => {
  if (!app) {
    console.log("app first");
    await store.dispatch("getUser");
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

export const db = firebase.firestore();
