<template>
  <div>
    <h3>
      You can only proceed with admin account creation when it is approved!
    </h3>

    <Button @click="landing"> Back to home page</Button>
  </div>
</template>

<script>
import { auth } from "@/firebase/init";

export default {
  name: "WaitApproval",
  components: {},
  methods: {
    landing() {
      this.$router.push("/");
    },
    home() {
      this.$router.push("/home");
    }
  },
  data() {
    return {
      email: auth.email,
      potentialAdmin: false
    };
  },
  async mounted() {}
};
</script>
