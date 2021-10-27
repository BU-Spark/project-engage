<template>
  <v-app>
    <v-row no-gutters>
      <!-- display spark! logo and "Welcome to Spark!" -->
      <v-col cols="12" md="5">
        <v-container
          fill-height
          fill-width
          fluid
          style="background-color:black; "
        >
          <v-row align="center" justify="center">
            <v-col>
              <center>
                <v-card
                  class="rounded-circle"
                  :style="
                    'border: 6px solid #00A99E; background-color:black; width:70%; height:70%'
                  "
                >
                  <v-col class="d-flex flex-column justify-center align-center">
                    <v-img
                      :src="require('../../assets/sparky.png')"
                      height="90%"
                      width="90%"
                      border-radius="100%"
                      outl
                      style="margin-bottom: 5%; margin-top: 3%; margin-right: 5%; margin-left: 5%"
                    ></v-img>
                  </v-col>
                </v-card>
              </center>
              <div
                style="display:block; background-color: black; height: 30px;"
              ></div>
              <h1 style="color:#00A99E; font-weight: 900;">
                <span style="color:white; font-weight: 900;">Welcome to </span
                >SPARK!
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- display "student" or "admin" selection animation (with different views) -->
      <v-col cols="12" md="7">
        <v-container fill-height fluid>
          <!-- view 0: choose role -->
          <v-col
            v-if="view == 0"
            class="d-flex flex-column justify-center align-center"
          >
            <!-- invisible login button so that login page router push is successful -->
            <GoogleLoginButton buttonLabel="Sign in with Google" hide="true" />

            <v-row>
              <!-- admin selection animation -->
              <v-col>
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
                        roleSelected == 'admin'
                          ? 'margin-right:115px; margin-left:-30px'
                          : ''
                      "
                    />
                    <v-card-text
                      :style="
                        roleSelected == 'admin'
                          ? 'visibility:visible; opacity: 1;'
                          : ''
                      "
                      id="adminText"
                      class="text"
                    >
                      Hey admin! Check up on your Spark! dashboard with me.
                    </v-card-text>
                    <div style="display:block; height: 10px;"></div>
                    <v-card-text
                      style="font-weight: 900; font-size: 25px; color: black;"
                    >
                      Admin
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- student selection animation -->
              <v-col>
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
                        roleSelected == 'student' ? 'margin-left: 100px;' : ''
                      "
                    />
                    <v-card-text
                      :style="
                        roleSelected == 'student'
                          ? 'visibility:visible; opacity: 1;'
                          : ''
                      "
                      id="studentText"
                      class="text"
                    >
                      Hey student! I'll help you apply to Spark!
                    </v-card-text>
                    <div style="display:block; height: 10px;"></div>
                    <v-card-text
                      style="font-weight: 900; font-size: 25px; color: black;"
                    >
                      Student
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>

            <div style="display:block; height: 50px;"></div>
            
            <v-btn
              x-large
              color="#00A99E"
              class="ma-4 pl-16 pr-16 white--text bold--text"
              style="font-weight: 900; font-size:20px;"
              rounded
              @click="updateView(1)"
            >
              CONTINUE
            </v-btn>
          </v-col>

          <!-- view 1 student: log in -->
          <v-col
            v-if="view == 1 && roleSelected == 'student'"
            class="d-flex flex-column justify-center align-center"
          >
            <h1>Student sign in</h1>
            <GoogleLoginButton buttonLabel="Sign in with Google" />
            <v-btn class="ma-4" @click="updateView(0)">
              Back
            </v-btn>
          </v-col>

          <!-- view 1 admin: log in or sign up -->
          <v-col
            v-if="view == 1 && roleSelected == 'admin'"
            class="d-flex flex-column justify-center align-center"
          >
            <h1>Admin sign in</h1>
            <v-alert v-if="errorMsg"> {{ errorMsg }}</v-alert>
            <h3>Login</h3>
            <h4>
              <GoogleLoginButton buttonLabel="Log in with Google" />
            </h4>
            <br />
            <h3>Sign Up</h3>
            <v-btn color="#36bd90" class="ma-4" @click="updateView(2)" rounded>
              Admin Sign Up
            </v-btn>
            <v-btn class="ma-4" @click="updateView(0)">
              Back
            </v-btn>
          </v-col>

          <!-- view 2 admin sign up: check email -->
          <v-col
            v-if="view == 2 && roleSelected == 'admin'"
            class="d-flex flex-column justify-center align-center"
          >
            <AdminLogin />
          </v-col>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import store from "@/store";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
import AdminIcon from "@/components/Login/admin.vue";
import StudentIcon from "@/components/Login/student.vue";
import AdminLogin from "@/views/AdminLogin";
export default {
  name: "LoginForm",
  roleSelected: null,
  elevation: 0,
  components: {
    GoogleLoginButton,
    AdminLogin,
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
    return {
      roleSelected: null,
      view: 0
    };
  },
  methods: {
    applicationForm() {
      this.$router.push("/application");
    },
    clickedRole(role) {
      this.roleSelected = role;
      if (role == "student") {
        this.roleSelected = "student";
      } else {
        this.roleSelected = "admin";
      }
    },
    updateView(page) {
      if (this.roleSelected != null) {
        this.view = page;
      }
    }
  }
};
</script>

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

/* #studentText:after {
  left: 10px;
  border-right: 20px solid transparent;
} */

#adminText {
  right: 20px;
}

/* #adminText:after {
  right: 90px;
  border-left: 20px solid transparent;
} */

.text {
  position: absolute;
  bottom: 100px;
  visibility: hidden;
  width: 120px;
  height: 150px;
  text-align: left;
  background-color: rgba(0, 176, 161, 0.3);
  border-radius: 10px;
  opacity: 0.6;
  transition: opacity 2s ease-in-out;
  font-weight: 700;
}

/* .text:after {
  content: "";
  position: relative;
  bottom: 2.5px;
  border-top: 20px solid rgba(0, 176, 161, 0.3);
  border-top-color: rgba(0, 176, 161, 0.3);
} */

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
