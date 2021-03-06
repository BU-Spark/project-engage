<template>
  <div>
    <h3>Login</h3>
    <form>
      <Button v-on:click="login"> Student Login </Button>
      <div>
        <Button> Admin Login </Button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: "LoginForm",
  data() {
    return {
      email: null,
      password: null
    };
  },
  components: {},
  methods: {
    async forgetPW() {
      var auth = firebase.auth();
      var emailAddress = this.email;

      auth
        .sendPasswordResetEmail(emailAddress)
        .then(function() {
          var message =
            "An email has been sent to help you reset your password.";
          alert(message);
        })
        .catch(function(error) {
          var errorMessage = error.message;
          alert(errorMessage);
        });
    },
    async login() {
      console.log("here");
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().useDeviceLanguage();
      firebase.auth().signInWithRedirect(provider);
      // this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
