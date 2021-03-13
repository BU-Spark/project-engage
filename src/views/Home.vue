<template>
  <div>
    Welcome!

    <h1>{{ this.email }}</h1>
    <h1 v-if="!this.potentialAdmin">Please wait for verification</h1>
    <h1 v-if="this.potentialAdmin">Successfully logged in as admin</h1>
    <Button @click="signOut"> Log Out</Button>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      email: null,
      potentialAdmin: false
    };
  },
  async mounted() {}
};
</script>
