<template>
  <div>
    <div v-if="this.isAdmin">
      <AdminDashboard />
    </div>
    <div v-if="!this.isAdmin">
      <StudentDashboard />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";
import StudentDashboard from "@/components/Student/StudentDashboard.vue";

export default {
  name: "Home",
  components: {
    AdminDashboard,
    StudentDashboard
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
  methods: {},
  async mounted() {
    console.log("this.$store.state.isAdmin");
    console.log(this.$store.state.isAdmin);
  }
};
</script>
