<!-- This template display the selected student application in the expanded section of the data table -->
<template>
  <div class="exp-app-container">
    <h3>Student Application</h3>
    <v-btn @click="saveApplicationPDF" style="margin-top: 10px">
      <v-icon aria-hidden="false" style="color: #00a99e; padding-right: 10px">
        mdi-file-document-outline
      </v-icon>
      Save application as PDF
    </v-btn>
    <!-- {{ item }} -->

    <!-- application form display -->
    <div v-if="this.schema.length != 0">
      <FormulateForm class="form-wrapper" v-model="item" :schema="schema" />
    </div>
    <div v-if="this.schema.length == 0" style="margin: 10px;">
      <h4>Loading...</h4>
      (If stuck, application may be invalid)
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
export default {
  name: "ExpandedApplication",
  props: ["item"],
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Semester",
          value: "semester"
        },
        {
          text: "Program",
          value: "program"
        },
        {
          text: "Year",
          value: "year"
        },
        {
          text: "Gender",
          value: "gender"
        },
        {
          text: "Email",
          value: "email"
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Notes",
          value: "notes"
        }
      ],
      schema: [],
      values: null,
      userBaseRef: null,
      section: 0,
      dialog: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    goBack() {
      this.$emit("typeChange", null);
    },
    saveApplicationPDF() {
      let route = this.$router.resolve({
        name: "studentAppExport"
      });
      window.localStorage["params"] = JSON.stringify({
        item: this.item
      });
      window.open(route.href, "_blank");
    },
    async retrieveSchema() {
      //grab user application inputs
      this.values = this.item;

      // grab application form template
      const formRef = db
        .collection("applicationTemplate")
        .doc(this.item.program);
      const formSnapshot = await formRef.get();
      const template = formSnapshot.data();
      if (
        template[this.item.semester] &&
        template[this.item.semester]["schema"]
      ) {
        this.schema = template[this.item.semester]["schema"];
        let temp = [];
        for (let i = 0; i < this.schema.length; i++) {
          if (this.schema[i]["type"] == "file") {
            this.schema[i] = {
              label: this.schema[i]["label"],
              name: this.schema[i]["name"],
              type: "textarea"
            };
            if (this.values[this.schema[i]["name"]]) {
              var tempStr = "";
              for (
                var j = 0;
                j < this.values[this.schema[i]["name"]].length;
                j++
              ) {
                tempStr += this.values[this.schema[i]["name"]][j]["url"] + "\n";
              }
              this.values[this.schema[i]["name"]] = tempStr;
            }
          }
          // If type != "hr" or "submit", push to schema
          if (
            !(
              this.schema[i]["type"] == "hr" ||
              this.schema[i]["type"] == "submit"
            )
          ) {
            // Adding wrapper around form inputs to customize css in more detail
            this.schema[i] = {
              component: "div",
              class: "exp-app-input-wrapper",
              children: [this.schema[i]]
            };
            temp.push(this.schema[i]);
          }
        }
        this.schema = temp;
      }
    }
  },
  async mounted() {
    await this.retrieveSchema();
  },
  watch: {
    // Update schema and force update when the program/form changes
    async item(val, oldVal) {
      if (val.program !== oldVal.program) console.log("TEST");
      await this.retrieveSchema();
      this.$forceUpdate();
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

.form-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1em;
  font-size: 14px;
}
.exp-app-container {
  padding: 20px;
  justify-content: center;
  /* background-color: rgb(241, 248, 243); */
}
</style>

<!-- Global style -->
<style>
.exp-app-input-wrapper {
  flex: 50%;
}

.v-data-table__expanded {
  background-color: rgb(241, 248, 243);
}
</style>
