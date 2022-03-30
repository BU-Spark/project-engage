<!-- Template for inviting admins and sending them an email -->
<template>
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
    //Can change current student account to an admin account as well
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
  </div>
</template>
<script>
import { functions, db } from "@/firebase/init";
export default {
  name: "InviteAdmin",
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
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    adminValidation() {
      return this.$store.state.adminValidation;
    },
    snapshot() {
      return this.$store.state.snapshot;
    }
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
      //add invitee email to the firebase collection
      if (this.addAdminEmail != null) {
        await this.$store.dispatch("validateAdmin", this.addAdminEmail);
        if (!(await this.adminValidation)) {
          await db
            .collection("invites")
            .doc()
            .set({
              inviteeEmail: this.addAdminEmail,
              invitorEmail: this.user.email
            });
          //start changerole process on Firebase function
          await this.$store.dispatch("getSnapshot", [
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
      console.log("send email function");
      functions.httpsCallable("sendEmail")({
        to: ["<" + this.addAdminEmail + ">"],
        message: this.inviteMessage,
        subject: "You are Invited to be a Spark Admin!",
        cc: [],
        bcc: [],
        files: []
      });
    }
  }
};
</script>

<style scoped>
v-text-field {
  width: 200px;
}
</style>
