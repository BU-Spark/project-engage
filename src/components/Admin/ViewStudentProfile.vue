<template>
  <div>
    <div>
      <FormulateForm
        class="form-wrapper"
        v-model="values"
        :schema="[
          {
            label: 'Resume',
            type: 'button',
            name: 'resume',
            '@click': e =>
              openDocument(
                'https://firebasestorage.googleapis.com/v0/b/spark-project-engage.appspot.com/o/14PFYGIpmcSiE5ySNgKwNoaApE52%20Base%20resume%200.pdf?alt=media&token=a8bf00bf-e2ed-4681-b6bc-91ed51638410'
              )
          }
        ]"
      />

      <h3>Student Profile</h3>

      <!-- student info -->
      <v-data-table
        :headers="headers"
        :items="information"
        :single-select="false"
        item-key="test"
        class="elevation-1"
        hide-default-footer
      ></v-data-table>

      <!-- application form display -->
      <div
        v-if="this.schema.length != 0"
        style="margin-top: 30px;margin-bottom: 30px;"
      >
        <v-stepper v-model="section" vertical>
          <template v-for="(n, i) in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="section > n"
              :step="i"
              editable
              class="stepperColor"
            >
              {{ n }}
            </v-stepper-step>
            <v-stepper-content :key="`${n}-content`" :step="i">
              <FormulateForm
                class="form-wrapper"
                v-model="values"
                :schema="schemaList[i]"
              />
            </v-stepper-content>
          </template>
        </v-stepper>
      </div>
    </div>
    <!-- <pdf src="this.item.resume[0].url"></pdf> -->
    <h2 v-if="this.schema.length == 0" style="margin: 10px;">
      This application is not valid
    </h2>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
export default {
  name: "ViewStudentProfile",
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
      information: [],
      schema: [],
      schemaList: [],
      values: null,
      userBaseRef: null,
      steps: [],
      section: 1,
      dialog: false,
      preview: null
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
    openDocument(document) {
      window.open(document);
    }
  },
  async mounted() {
    this.information = [
      {
        name: this.item.firstname + " " + this.item.lastname,
        semester: this.item.semester,
        program: this.item.program,
        year: this.item.schoolYear,
        gender: this.item.gender,
        email: this.item.email,
        status: this.item.status == 0 ? "Started" : "Submitted",
        notes: this.item.note
      }
    ];

    //grab user application inputs
    const userBaseRef = db
      .collection("applications")
      .doc("Base")
      .collection("All")
      .doc(this.item.uid);
    const doc = await userBaseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
    }

    // grab application form template
    const formRef = db.collection("applicationTemplate").doc("Base");
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template["Template"]["schema"];
    var temp = [];
    for (let i = 0; i < this.schema.length; i++) {
      if (this.schema[i]["type"] == "hr") {
        this.schemaList.push(temp);
        this.steps.push(this.schema[i]["label"]);
        temp = [];
      } else if (this.item.status == 1 && this.schema[i]["type"] == "submit") {
        // don't add the save button
      } else if (this.schema[i]["type"] == "file") {
        let label = this.schema[i]["label"];
        let name = this.schema[i]["name"];
        let files = this.values[this.schema[i]["name"]];
        files = files.map(file => {
          return {
            label: label,
            name: name,
            type: "button",
            "@click": () => this.openDocument(file.url)
          };
        });
        this.schema[i] = {
          type: "group",
          name: this.schema[i]["name"],
          label: this.schema[i]["label"],
          children: files
        };
        temp.push(this.schema[i]);
      } else {
        temp.push(this.schema[i]);
      }
    }
    this.schemaList.push(temp);
    this.schemaList = this.schemaList.filter(e => e.length);
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

.form-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2em;
  border: 2px solid rgba(200, 200, 200, 0.1);
  border-radius: 2.5em;
  box-sizing: border-box;
  background-color: #f1f8f3;
}

.stepperColor {
  background-color: #f1f8f3;
  border-radius: 2.5em;
}
</style>
