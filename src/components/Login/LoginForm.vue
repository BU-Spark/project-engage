<template>
  <div>
    <h3>Login</h3>
    <Button @click="login"> Student Login </Button>
    <div>
      <Button @click="adminLogin"> Admin Login </Button>
    </div>

    <div>
      <input
        v-bind:value="addAdminEmail"
        v-on:input="addAdminEmail = $event.target.value"
      />
      <Button @click="addAdmin()"> Admin add admin page </Button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import store from "@/store";
import { db, auth } from "@/firebase/init";

export default {
  name: "LoginForm",
  data() {
    return {
      email: null,
      password: null,
      addAdminEmail: null
    };
  },
  components: {},
  computed: {
    adminValidation() {
      return this.$store.state.adminValidation;
    }
  },
  methods: {
    async login() {
      console.log("here");
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: "bu.edu",
        prompt: "select_account"
      });
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    },
    async adminLogin() {
      console.log("here");
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);

      this.$router.push("/home");
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
    auth.getRedirectResult().then(result => {
      if (result.additionalUserInfo.profile.hd == "bu.edu") {
        console.log(result);
        store.dispatch("setUser", "student");
        this.$router.push("/home");
      } else {
        this.$store.dispatch("logOut");
        this.$router.push("/pending");
      }

      // if (result) {
      //   console.log(result);
      //   store.dispatch("setAdminValidation");
      //   if (this.adminValidation) {
      //     store.dispatch("setUser", "admin");
      //     this.$router.push("/home");
      //   } else {
      //     this.$store.dispatch("logOut");
      //     this.$router.push("/pending");
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
</style>
