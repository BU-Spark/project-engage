<template>
  <div>
    <h3>
      You can only proceed with admin account creation when it is approved!
    </h3>

    <Button @click="home"> Back to home page</Button>
  </div>
</template>

<script>
export default {
  name: "WaitApproval",
  components: {},
  methods: {
    home() {
      this.$router.push("/");
    }
  }
};
</script>
