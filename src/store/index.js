import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import router from "@/router";
import { db, auth } from "@/firebase/init.js";

Vue.use(Vuex);

let defaultSetup = (user, context) => {
  user.getIdTokenResult(true).then(result => {
    context.commit("setAdmin", result.claims.admin);
    context.commit("setAdminValidation", result.claims.admin);
  });
};

// Persistent storage so state is retained on page reloads!
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
});

export default new Vuex.Store({
  state: {
    user: null,
    isAdmin: null,
    adminValidation: null,
    errorMsg: null,
    snapshot: null,
    type: null,
    chosenSemester: [],
    chosenProgram: [],
    chosenStatus: [],
    profileOpen: false
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
    },
    setSnapshot: (state, data) => {
      state.snapshot = data;
    },
    setType: (state, data) => {
      state.type = data;
    },
    setChosenSemester(state, data) {
      state.chosenSemester = data;
    },
    setChosenProgram(state, data) {
      state.chosenProgram = data;
    },
    setChosenStatus(state, data) {
      state.chosenStatus = data;
    },
    closeProfile(state) {
      state.profileOpen = false;
    },
    openProfile(state) {
      state.profileOpen = true;
    }
  },
  actions: {
    getUser: async context => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const mydb = db.collection("users").doc(user.uid);
      var raid = await mydb.get();
      if (!raid.exists) {
        db.collection("users")
          .doc(user.uid)
          .onSnapshot(snapshot => {
            defaultSetup(user, context);
            context.commit("setUser", snapshot.data());
            router.push("/home");
          });
      } else {
        defaultSetup(user, context);
        context.commit("setUser", raid.data());
      }
    },
    logOut: async context => {
      await auth.signOut();
      context.commit("setUser", null);
      context.commit("setAdminValidation", false);
    },
    validateAdmin: async (context, email) => {
      const usersRef = db.collection("invites");
      const snapshot = await usersRef.where("inviteeEmail", "==", email).get();
      if (!snapshot.empty) {
        context.commit("setAdminValidation", true);
      } else {
        context.commit("setAdminValidation", false);
      }
    },
    getSnapshot: async (context, [col, field, variable]) => {
      const snap = await db
        .collection(col)
        .where(field, "==", variable)
        .get();
      context.commit("setSnapshot", snap);
    }
  },
  plugins: [vuexLocal.plugin]
});
