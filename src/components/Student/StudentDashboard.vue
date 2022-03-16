<!-- route: /home -->
<template>
  <div>
    <StudentNavbar />
    <Applications />
  </div>
</template>

<script>
import StudentNavbar from "@/components/Student/StudentNavbar.vue";
import Applications from "@/components/Student/Applications.vue";
export default {
  name: "StudentDashboard",
  components: {
    StudentNavbar,
    Applications
  },
  data() {
    return {
      window
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  async mounted() {}
};
</script>
