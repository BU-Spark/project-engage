<template>
  <div>
    <v-alert dark v-if="errorMsg">
      {{ errorMsg }}
    </v-alert>
    <h3>Log</h3>
    <v-btn class="ma-2" @click="login"> Student Login </v-btn>
    <div><v-btn class="ma-2" @click="adminLogin"> Admin Login </v-btn></div>

    <div>
      <v-text-field
        outlined
        v-bind:value="addAdminEmail"
        v-on:input="addAdminEmail = $event.target.value"
      >
      </v-text-field>
      <Button @click="addAdmin()"> Admin add admin page </Button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
//import store from "@/store";
import { db, auth } from "@/firebase/init";

export default {
  name: "LoginForm",
  data() {
    return {
      email: null,
      password: null,
      addAdminEmail: null,
      student: false,
      errorMsg: null
    };
  },
  components: {},
  computed: {
    adminValidation() {
      return this.$store.state.adminValidation;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async login() {
      this.student = true;
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: "bu.edu",
        prompt: "select_account"
      });
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    },
    async adminLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    },
    async addAdmin() {
      if (this.addAdminEmail != null) {
        alert("Entered email: " + this.addAdminEmail);

        await db
          .collection("invites")
          .doc()
          .set({
            inviteeEmail: this.addAdminEmail,
            invitorEmail: "invitorEmail@bu.edu"
          })
          .then(() => {
            // this.$router.push("/");
          });
      } else {
        alert("Please enter a email");
      }
    }
  },
  async mounted() {
    // ?????????????????? idk how to change this.admin to true ??????????????????
    // document.addEventListener("click", e => {
    //   let m = `x: ${e.clientX} | y: ${e.clientY}`;
    //   console.log(m);
    // })
    // console.log(this.$el.addEventListener('click', this.onClickVue))
    await auth.getRedirectResult().then(async result => {
      // if the user clicks on "Student Login"
      // if (this.student) {
      // db.collection("users")
      //   .doc(auth.currentUser.uid)
      //   .get()
      //   .then(doc => {
      //     // if user already saved to firestore, pushed to home directly
      //     if (doc.exists) {
      //       this.$router.push("/home");
      //     } else {
      //       this.$store.dispatch("setUser", "student");
      //       this.$router.push("/home");
      //     }
      //   });
      if (result.additionalUserInfo.profile.hd == "bu.edu") {
        //if this is a BU email
        if (!this.user) {
          await this.$store.dispatch("setUser", "student");
        }
        this.$router.push("/home");
      } else {
        //if it is not a BU email
        this.errorMsg =
          "You can only sign up for student accounts using BU accounts";
        setTimeout(() => {
          this.$store.dispatch("logOut");
        }, 1000);
      }
      // } else {
      //   if (!this.user) {
      //     await this.$store.dispatch(
      //       "validateAdmin",
      //       result.additionalUserInfo.profile.email
      //     );
      //     if (this.adminValidation) {
      //       await this.$store.dispatch("setUser", "admin");
      //       this.$router.push("/home");
      //     } else {
      //       this.errorMsg =
      //         "You can only proceed with admin account creation when it is approved!";
      //       setTimeout(() => {
      //         this.$store.dispatch("logOut");
      //       }, 1000);
      //     }
      //   } else {
      //     this.$router.push("/home");
      //   }
      // }
      // otherwise, the user either clicks on "Student Login" but not with bu email,
      // or clicked on "Admin Login"
      // else {
      //   if (this.student) {
      //     this.$store.dispatch("logOut");
      //   } else {
      //     db.collection("users")
      //       .doc(auth.currentUser.uid)
      //       .get()
      //       .then(doc => {
      //         if (doc.exists) {
      //           this.$router.push("/home");
      //         } else {
      //           // check if admin is in the invites collection
      //           const snapshot = db
      //             .collection("invites")
      //             .where(
      //               "inviteeEmail",
      //               "==",
      //               result.additionalUserInfo.profile.email
      //             )
      //             .get();
      //           if (!snapshot.empty) {
      //             this.potentialAdmin = true;
      //           }
      //           if (this.potentialAdmin) {
      //             snapshot.forEach(doc => {
      //               db.collection("invites")
      //                 .doc(doc.id)
      //                 .delete();
      //             });
      //             store.dispatch("setUser", "admin");
      //             this.$router.push("/home");
      //           } else {
      //             this.$store.dispatch("logOut");
      //             this.$router.push("/pending");
      //           }
      //         }
      //       });
      //   }
      // }
    });
  }
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
v-text-field {
  width: 200;
}
</style>
