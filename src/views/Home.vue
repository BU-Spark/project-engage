<template>
  <div>
    <div v-if="this.isAdmin">
      <AdminHome />
    </div>
    <div v-if="!this.isAdmin">
      <StudentHome />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import AdminHome from "@/components/Admin/AdminHome.vue";
import StudentHome from "@/components/Student/StudentHome.vue";

export default {
  name: "Home",
  components: {
    AdminHome,
    StudentHome
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    adminValidation() {
      return store.state.adminValidation;
    },
    snapshot() {
      return store.state.snapshot;
    }
  },
  data() {
    return {
      addAdminEmail: null,
      emailValidated: false,
      adminExists: false
    };
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
