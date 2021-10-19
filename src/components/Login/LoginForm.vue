<template>
  <center>
    <v-container class="ma-14">
      <v-row no-gutters style="height: 300px;">
        <v-col no-gutters>
          <v-card class="pa-14" outlined tile>
            <center>
              <v-img
                :src="require('../../assets/sparky.png')"
                height="251px"
                width="251px"
                border-radius="100px"
              ></v-img>
            </center>
            <center><h1>Welcome to SPARK!</h1></center>
          </v-card>
        </v-col>
        <v-col>
          <v-row no-gutters>
            <v-col no-gutters>
              <v-hover v-slot="{ hover }" close-delay="200">
                <v-card
                  :elevation="hover ? 16 : 0"
                  :class="{ 'on-hover': hover }"
                  class="mx-auto rounded-xl"
                  min-height="300"
                  max-width="270"
                  id="admin"
                  @click.native="clickedRole('admin')"
                  :style="
                    roleSelected == 'admin'
                      ? 'background-color:white; border: 5px solid #00A99e;'
                      : 'background-color:#e5ede6; border: none;'
                  "
                >
                  <AdminIcon
                    class="icon"
                    id="adminIcon"
                    :style="
                      roleSelected == 'admin' ? 'margin-right:100px;' : ''
                    "
                  />
                  <v-card-text
                    :style="
                      roleSelected == 'admin'
                        ? 'visibility:visible; opacity:1;'
                        : ''
                    "
                    id="adminText"
                    class="text"
                  >
                    some text
                  </v-card-text>
                  <v-card-text
                    class="font-weight-medium text-center text-subtitle-1"
                  >
                    Admin
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col no-gutters>
              <v-hover v-slot="{ hover }" close-delay="200">
                <v-card
                  :elevation="hover ? 16 : 0"
                  :class="{ 'on-hover': hover }"
                  class="mx-auto rounded-xl"
                  min-height="300"
                  max-width="270"
                  id="student"
                  @click.native="clickedRole('student')"
                  :style="
                    roleSelected == 'student'
                      ? 'background-color:white; border: 5px solid #00A99e;'
                      : 'background-color:#e5ede6; border: none;'
                  "
                >
                  <StudentIcon
                    class="icon"
                    id="studentIcon"
                    :style="
                      roleSelected == 'student' ? 'margin-left: 80px;' : ''
                    "
                  />
                  <v-card-text
                    :style="
                      roleSelected == 'student'
                        ? 'visibility:visible; opacity:1;'
                        : ''
                    "
                    id="studentText"
                    class="text"
                  >
                    some text
                  </v-card-text>
                  <v-card-text
                    class="font-weight-medium text-center text-subtitle-1"
                  >
                    Student
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
          <GoogleLoginButton class="ma-2" buttonLabel="Student Signup" />
        </v-col>
      </v-row>
    </v-container>
  </center>
</template>

<style scoped>
.icon {
  height: 175px;
  width: 175px;
  margin-top: 20px;
  position: relative;
  transition: 2s;
}

#admin:hover .icon {
  position: relative;
  margin-right: 100px;
}

#student:hover .icon {
  margin-left: 100px;
}

#studentText {
  left: 20px;
}

#studentText:after {
  left: 10px;
  border-right: 20px solid transparent;
}

#adminText {
  right: 20px;
}

#adminText:after {
  right: 90px;
  border-left: 20px solid transparent;
}

.text {
  position: absolute;
  bottom: 100px;
  visibility: hidden;
  width: 100px;
  height: 150px;
  background-color: #00a99e;
  border-radius: 10px;
  opacity: 0.6;
  transition: opacity 2s ease-in-out;
}

.text:after {
  content: "";
  position: relative;
  top: 2.5px;
  /* left: 10px; */
  border-top: 20px solid #00a99e;
  border-top-color: #00a99e;
  /* border-left: 20px solid transparent; */
}

#student:hover #studentText {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.55s ease-in-out;
}

#admin:hover #adminText {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.55s ease-in-out;
}
</style>

<script>
import store from "@/store";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
import AdminIcon from "@/components/Login/admin.vue";
import StudentIcon from "@/components/Login/student.vue";

export default {
  name: "LoginForm",
  roleSelected: "none",
  elevation: 0,
  components: {
    GoogleLoginButton,
    AdminIcon,
    StudentIcon
  },
  computed: {
    adminValidation() {
      return store.state.adminValidation;
    },
    errorMsg() {
      return store.state.errorMsg;
    },
    thisElevation() {
      return this.elevation;
    }
  },
  data() {
    return {};
  },
  methods: {
    admin() {
      this.$router.push("/AdminLogin");
    },
    applicationForm() {
      this.$router.push("/application");
    },
    clickedRole(role) {
      this.roleSelected = role;
    }
  }
};
</script>
