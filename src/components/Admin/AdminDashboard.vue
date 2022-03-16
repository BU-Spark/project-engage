<!-- route: /home -->
<template>
  <div>
    <AdminNavbar />
    <InviteAdmin />
    <EmailUI />
  </div>
</template>

<script>
import AdminNavbar from "@/components/Admin/AdminNavbar.vue";
import InviteAdmin from "@/components/Admin/InviteAdmin.vue";
import EmailUI from "@/components/Admin/EmailUI.vue";

export default {
  name: "AdminDashboard",
  components: {
    AdminNavbar,
    InviteAdmin,
    EmailUI
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {},
  async mounted() {}
};
</script>
