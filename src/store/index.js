import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import { db, auth } from "@/firebase/init.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isAdmin: null,
    adminValidation: null,
    errorMsg: null
  },
  mutations: {
    setUser: (state, data) => {
      state.user = data;
    },
    setAdminValidation: (state, data) => {
      state.adminValidation = data;
    },
    setAdmin: (state, data) => {
      state.isAdmin = data;
    },
    setErrorMsg: (state, data) => {
      state.errorMsg = data;
    }
  },
  actions: {
    setUser: async context => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      db.collection("users")
        .doc(user.uid)
        .onSnapshot(snapshot => {
          user.getIdTokenResult(true).then(result => {
            if (result.claims.admin) {
              context.commit("setAdmin", result.claims.admin);
            }
          });
          context.commit("setUser", snapshot.data());
          router.push("/home");
        });
    },
    getUser: async context => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const mydb = db.collection("users").doc(user.uid);
      var raid = await mydb.get();
      user.getIdTokenResult(true).then(result => {
        if (result.claims.admin) {
          context.commit("setAdmin", result.claims.admin);
        }
      });
      context.commit("setUser", raid.data());
    },
    logOut: async context => {
      await auth.signOut();
      context.commit("setUser", null);
    },
    validateAdmin: async (context, email) => {
      const usersRef = db.collection("invites");
      const snapshot = await usersRef.where("inviteeEmail", "==", email).get();
      if (!snapshot.empty) {
        context.commit("setAdminValidation", true);
      } else {
        context.commit("setAdminValidation", false);
      }
    }
  }
});
