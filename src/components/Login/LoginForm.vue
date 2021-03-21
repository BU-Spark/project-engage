<template>
  <div>
    <div>
      <v-text-field outlined v-model="emailEntered"> </v-text-field>
      <div><v-btn class="ma-2" @click="checkEmail()"> Check Email </v-btn></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "LoginForm",
  data() {
    return {
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
          // this.$router.push("/home");
          alert("user has been invited");
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
