<template>
  <div>
    <p>Successfully logged in as admin</p>
    <v-container>
      <InviteAdmin />
    </v-container>
    <v-container>
      <ApplicationFormListDisplay />
    </v-container>
    <v-container>
      <EmailUI />
    </v-container>
    <v-btn @click="changeRoutes('/AdminApplicationDashboard')"
      >View Submitted Application</v-btn
    >
  </div>
</template>

<script>
import EmailUI from "@/components/Admin/EmailUI.vue";
import ApplicationFormListDisplay from "@/components/Application/ApplicationFormListDisplay.vue";
import InviteAdmin from "@/components/Admin/InviteAdmin.vue";

export default {
  name: "AdminHome",
  components: {
    EmailUI,
    ApplicationFormListDisplay,
    InviteAdmin
  },
  data() {
    return {};
  },
  methods: {
    changeRoutes(route) {
      this.$router.push(route);
    }
  },
  async mounted() {}
};
</script>
