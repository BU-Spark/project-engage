import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import { db } from "@/firebase/init.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    adminValidation: null
  },
  mutations: {
    setUser: (state, data) => {
      state.user = data;
    },
    setAdminValidation: (state, data) => {
      state.adminValidation = data;
    }
  },
  actions: {
    async setUser(context, role) {
      const user = firebase.auth().currentUser;
      if (!user) {
        return;
      }
      const mydb = db.collection("users").doc(user.uid);
      var raid = await mydb.get();
      if (!raid.exists) {
        await mydb.set({
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          role: role
        });
        raid = await mydb.get();
        context.commit("setUser", raid.data());
      } else {
        context.commit("setUser", raid.data());
      }
    },
    getUser: async context => {
      const user = firebase.auth().currentUser;
      if (!user) {
        return;
      }
      const mydb = db.collection("users").doc(user.uid);
      var raid = await mydb.get();
      context.commit("setUser", raid.data());
    },
    logOut: async context => {
      await firebase.auth().signOut();
      context.commit("setUser", null);
    },
    validateAdmin: async context => {
      const usersRef = db.collection("invites");
      const snapshot = await usersRef
        .where("inviteeEmail", "==", this.email)
        .get();
      if (!snapshot.empty) {
        context.commit("setAdminValidation", true);
      } else {
        context.commit("setAdminValidation", false);
      }
    }
  }
});
