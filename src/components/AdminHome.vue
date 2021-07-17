<template>
  <div>
    <p>Successfully logged in as admin</p>
    <!-- application form: TO BE MOVED LATER -->
    <v-btn color="#36bd90" class="ma-4" @click="applicationFormList" rounded>
      Manage Program Application Forms
    </v-btn>
    <div>
      <v-text-field
        outlined
        v-model="addAdminEmail"
        :rules="emailRules"
        @change="checkEmail"
      >
      </v-text-field>
      <v-btn
        elevation="2"
        outlined
        plain
        raised
        class="ma-2"
        @click="addAdmin()"
        :disabled="!emailValidated"
        v-if="!this.adminExists"
      >
        Invite Admin
      </v-btn>
      <v-alert dark v-if="this.adminExists">
        This email is currently registered as a student account, please click
        Change Role if you want to assign them admin permission
      </v-alert>
      <v-btn
        elevation="2"
        outlined
        plain
        raised
        class="ma-2"
        @click="changeRole()"
        v-if="this.adminExists"
      >
        Change Role
      </v-btn>
      <v-container>
        <EmailUI />
      </v-container>
    </div>
  </div>
</template>

<script>
import { functions, db } from "@/firebase/init";
import store from "@/store";
import EmailUI from "@/components/EmailUI.vue";

export default {
  name: "AdminHome",
  components: {
    EmailUI
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
      adminExists: false,
      inviteMessage:
        "So... what are you waiting for? 🤘❤️😎 <br/> <a href='https://buspark.app/AdminLogin'> Spark Central Portal </a>",
      emailRules: [
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Please enter a valid email"
      ]
    };
  },
  methods: {
    checkEmail() {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        this.emailValidated = true;
        return;
      }
      this.emailValidated = false;
    },
    async addAdmin() {
      if (this.addAdminEmail != null) {
        await store.dispatch("validateAdmin", this.addAdminEmail);
        if (!(await this.adminValidation)) {
          await db
            .collection("invites")
            .doc()
            .set({
              inviteeEmail: this.addAdminEmail,
              invitorEmail: this.user.email
            });
          await store.dispatch("getSnapshot", [
            "users",
            "email",
            this.addAdminEmail
          ]);
          if (this.snapshot.size > 0) {
            this.adminExists = true;
          } else {
            await this.sendInviteEmail();
            this.addAdminEmail = "";
            alert("invited email");
          }
        } else {
          alert("This email had already been invited to sign up as admin");
        }
      } else {
        alert("Please enter a email");
      }
    },
    async changeRole() {
      this.snapshot.forEach(doc => {
        this.sendInviteEmail();
        functions.httpsCallable("processChangeRole")({
          id: doc.id
        });
      });
      this.adminExists = false;
      this.addAdminEmail = "";
      alert("changed role");
    },
    sendInviteEmail() {
      functions.httpsCallable("sendEmail")({
        to: this.addAdminEmail,
        message: this.inviteMessage,
        subject: "You are Invited to be a Spark Admin!"
      });
    },
    applicationFormList() {
      this.$router.push("/applicationFormList");
    }
  },
  async mounted() {}
};
</script>
