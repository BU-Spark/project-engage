<template>
  <div>
    <h3>Login</h3>
    <form>
      <div>
        <input
          v-model="email"
          type="text"
          label="Email"
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          label="Password"
          placeholder="********"
        />
      </div>
      <div>
        <button color="info white--text" @click="login">Login</button>
      </div>
      <Button> Login with Google </Button>
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
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  }
};
</script>
