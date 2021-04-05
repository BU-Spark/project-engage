<template>
  <GoogleLoginForm />
</template>

<script>
// @ is an alias to /src
import GoogleLoginForm from "@/components/Login/GoogleLoginButton";

export default {
  name: "GoogleLogin",
  components: {
    GoogleLoginForm
  }
};
</script>
