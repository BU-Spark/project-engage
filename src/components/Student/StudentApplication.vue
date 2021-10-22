<template>
  <div>
    <FormulateForm
      class="form-wrapper"
      v-model="values"
      :schema="schema"
      @submit="submitProfile"
    />
    <v-overlay v-if="loading">
      <div>
        <v-progress-circular
          :size="70"
          indeterminate
          color="green"
        ></v-progress-circular>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
export default {
  name: "StudentApplication",
  props: ["type", "semester"],
  data() {
    return {
      schema: [],
      values: null,
      userBaseRef: null,
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async submitProfile() {
      this.loading = true;
      this.values.program = this.type;
      await this.userBaseRef.set(this.values);
      const userRef = db.collection("users").doc(this.user.uid);
      const doc = await userRef.get();
      var applications = null;
      if (doc.data().applications) {
        applications = doc.data();
        if (!doc.data().applications[this.semester]) {
          applications["applications"][this.semester] = [];
        }
        applications["applications"][this.semester].some(x => {
          return x.type == this.type;
        }) === false
          ? applications["applications"][this.semester].push({
              type: this.type,
              status: "started"
            })
          : console.log("application exisited");
      } else {
        applications = {};
        applications[this.semester] = [];
        applications[this.semester].push({
          type: this.type,
          status: "started"
        });
      }
      console.log(applications);
      await userRef.update({ applications: applications });
      this.$router.go();
    }
  },
  async mounted() {
    //grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.type);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template["Template"]["schema"];

    //grab user application inputs
    this.userBaseRef = db
      .collection("applications")
      .doc(this.semester)
      .collection(this.type)
      .doc(this.user.uid);
    const doc = await this.userBaseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
      console.log("Document data:", doc.data());
    }
  }
};
</script>

<style scoped>
div#main-actions {
  margin-right: 25px !important;
  float: right !important;
  right: -25px !important;
  padding: 15px !important;
  text-align: left !important;
}

v-btn {
  color: #36bd90;
}

.main-action {
  margin-right: 10px !important;
  border-radius: 15px;
  padding: 15px 0px;
}

div#dashboard-container {
  background-color: #36bd90;
  color: black;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}

div#rightSideDashboard {
  display: flex;
  justify-content: left;
  align-items: center;
}

.nav-btn {
  background-color: transparent !important;
  color: black !important;
  font-weight: 900 !important;
  border: none !important;
  /* font-size: 12px; */
}

.db-logo {
  margin: 5px 25px;
}
</style>
