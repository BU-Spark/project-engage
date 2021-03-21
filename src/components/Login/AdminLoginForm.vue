<template>
  <div>
    <div>
      <v-alert dark v-if="errorMsg">
        {{ errorMsg }}
      </v-alert>
      <v-text-field outlined v-model="emailEntered"> </v-text-field>
      <div><v-btn class="ma-2" @click="checkEmail()"> Check Email </v-btn></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AdminLoginForm",
  data() {
    return {
      errorMsg: null,
      emailEntered: null
    };
  },
  computed: {
    adminValidation() {
      return this.$store.state.adminValidation;
    }
  },
  methods: {
    async checkEmail() {
      await store.dispatch("validateAdmin", this.emailEntered);
      if (this.emailEntered != null && this.emailEntered != "") {
        if (this.$store.state.adminValidation) {
          // await this.$store.dispatch("setUser", "admin");
          alert("user has been invited as admin!");
          this.$router.push("/googleLogin");
        } else {
          this.errorMsg =
            "You can only proceed with admin account creation when it is approved!";
          setTimeout(() => {
            this.$store.dispatch("logOut");
          }, 1000);
        }
      } else {
        alert("please input an email");
      }
    }
  },
  async mounted() {}
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
