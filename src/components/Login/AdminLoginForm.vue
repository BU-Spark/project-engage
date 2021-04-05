<template>
  <div>
    <div>
      <v-alert dark v-if="errorMsg">
        {{ errorMsg }}
      </v-alert>
      <v-text-field outlined v-model="emailEntered"> </v-text-field>
      <div>
        <v-btn v-if="!this.adminVal" class="ma-2" @click="checkEmail()">
          Check Email
        </v-btn>
      </div>
      <GoogleLoginButton
        v-if="adminValidation"
        class="ma-2"
        buttonLabel="Admin Google Sign Up"
      />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
export default {
  name: "AdminLoginForm",
  components: {
    GoogleLoginButton
  },
  data() {
    return {
      errorMsg: null,
      emailEntered: null,
      adminVal: false
    };
  },
  computed: {
    adminValidation() {
      return store.state.adminValidation;
    },
    user() {
      return store.state.user;
    }
  },
  methods: {
    async checkEmail() {
      await store.dispatch("validateAdmin", this.emailEntered);
      if (this.emailEntered != null && this.emailEntered != "") {
        if (!this.adminValidation) {
          this.errorMsg =
            "You can only proceed with admin account creation when it is approved!";
        }
      } else {
        this.errorMsg = "Please enter an email";
      }
      this.adminVal = true;
    }
  },
  async mounted() {
    if (this.user) {
      this.$router.push("/home");
    }
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
