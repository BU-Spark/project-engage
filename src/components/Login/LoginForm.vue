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
      // alert("heelo"+this.addAdminEmail)
      if (this.addAdminEmail != null) {
        alert("Entered email: " + this.addAdminEmail);

        await db
          .collection("invites")
          .doc("adminInvites")
          .update({
            inviteName: {
              inviteeEmail: this.addAdminEmail,
              invitorEmail: "invitorEmail@bu.edu"
            }
          })
          .then(() => {
            // this.$router.push("/");
          });
      } else {
        alert("Please enter a email");
      }
    }
  },
  mounted() {
    auth.getRedirectResult().then(result => {
      console.log(result);
    });
    auth.onAuthStateChanged(user => {
      console.log(user);
    });
  }
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
