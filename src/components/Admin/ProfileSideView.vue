<template>
  <div>
    <v-row style="padding: 15px; padding-bottom: 5px;">
      <button @click="closeProfile" style="">
        <v-icon aria-hidden="false">
          mdi-close
        </v-icon>
      </button>
    </v-row>
    <v-row style="justify-content: center; margin-bottom: 4px">
      <v-icon aria-hidden="false" style="color: #00a99e; padding-right: 10px">
        mdi-account-details
      </v-icon>
      <h4>Student Profile</h4>
    </v-row>

    <v-btn @click="saveProfilePDF" style="margin-top: 10px">
      <v-icon aria-hidden="false" style="color: #00a99e; padding-right: 10px">
        mdi-file-document-outline
      </v-icon>
      Save profile as PDF
    </v-btn>

    <!-- application form display -->
    <div v-if="this.schema.length != 0">
      <v-btn
        v-if="resumeFileURL != undefined"
        @click="openDocument(resumeFileURL)"
        style="margin-top: 10px"
      >
        <v-icon aria-hidden="false" style="color: #00a99e; padding-right: 10px">
          mdi-arrow-down-thin-circle-outline
        </v-icon>
        Download Resume
      </v-btn>

      <!-- NOTE: Displaying profile info in FormulateForm doesn't make the most sense here since we only need to get data, 
        not post data. However, it is convenient to generate with the use of schemas (schema data is stored on our db as of writing).
        We can change form input css using global css (see src/assets/formulate.css) the issue here is that it is global -->
      <FormulateForm class="form-wrapper" v-model="profile" :schema="schema" />
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
  name: "ProfileSideView",
  props: ["profile"],
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
      dialog: false,
      preview: null
    };
  },
  computed: {
    resumeFileURL() {
      let url = null;
      if (this.profile.resume && this.profile.resume[0]) {
        url = this.profile.resume[0].url;
      }
      return url;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    //this allow for component refresh, and not refresh the whole page
    goBack() {
      this.$emit("typeChange", null);
    },
    openDocument(document) {
      window.open(document);
    },
    closeProfile() {
      this.$store.commit("closeProfile");
    },
    saveProfilePDF() {
      let route = this.$router.resolve({
        name: "studentProfileExport"
      });
      window.localStorage["params"] = JSON.stringify({
        item: this.profile
      });
      window.open(route.href, "_blank");
    }
  },
  async mounted() {
    //grab user application inputs
    const userBaseRef = db
      .collection("applications")
      .doc("Base")
      .collection("All")
      .doc(this.profile.uid);
    const doc = await userBaseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
    }

    // grab application form template
    const formRef = db.collection("applicationTemplate").doc("Base");
    const formSnapshot = await formRef.get();
    const formTemplate = formSnapshot.data();
    this.schema = formTemplate["Template"]["schema"];
    let temp = [];
    for (let i = 0; i < this.schema.length; i++) {
      let isFile = false;

      if (this.schema[i]["type"] == "file") {
        // Ignore resume file -> We manually add a download button for it
        if (this.schema[i]["name"] != "resume") {
          let label = this.schema[i]["label"];
          let name = this.schema[i]["name"];
          let files = this.values[name];
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
            label: null, // Dont show labels
            children: files
          };
        }

        isFile = true;

        // Re-naming form labels
      } else if (this.schema[i]["name"] == "ethnicity") {
        this.schema[i]["label"] = "Ethnicity";
      } else if (this.schema[i]["name"] == "race") {
        this.schema[i]["label"] = "Race";
      } else if (this.schema[i]["name"] == "college") {
        this.schema[i]["label"] = "College";
      } else if (this.schema[i]["name"] == "ECEInnovation") {
        this.schema[i]["label"] =
          "Participating in ECE's Tech Innovation Concentration?";
      } else if (this.schema[i]["name"] == "BUildLab") {
        this.schema[i]["label"] =
          "Participating in BUild Lab's Innovation Pathway?";
      } else if (this.schema[i]["name"] == "codingExperience") {
        this.schema[i]["label"] = "Coding experience in high school?";
      } else if (this.schema[i]["name"] == "hackathons") {
        this.schema[i]["label"] = "Number of hackathons participated in:";
      } else if (this.schema[i]["name"] == "projects") {
        this.schema[i]["label"] = "Number of GitHub projects:";
      } else if (this.schema[i]["name"] == "CScourses") {
        this.schema[i]["label"] = "CS courses taken:";
      } else if (this.schema[i]["name"] == "ECEcourses") {
        this.schema[i]["label"] = "ECE coursers in taken:";
      } else if (this.schema[i]["name"] == "MAcourses") {
        this.schema[i]["label"] = "Math courses taken:";
      } else if (this.schema[i]["name"] == "CFAcourses") {
        this.schema[i]["label"] = "Design courses taken:";
      } else if (this.schema[i]["name"] == "degree") {
        this.schema[i]["label"] = "Master's CS degree program:";
      } else if (this.schema[i]["name"] == "projectPreference") {
        this.schema[i]["label"] = "Project Preference";
      } else if (this.schema[i]["name"] == "workStyle") {
        this.schema[i]["label"] = "Work style";
      }

      // If input type is not "hr" or "submit" or the input is not a resume, push to schema
      if (
        !(
          this.schema[i]["type"] == "hr" ||
          this.schema[i]["type"] == "submit" ||
          this.schema[i]["name"] == "resume"
        )
      ) {
        this.schema[i]["help"] = null;

        // Adding wrapper around form inputs to customize css in more detail
        this.schema[i] = {
          component: "div",
          class: "prof-side-view-input-wrapper",
          children: [this.schema[i]]
        };

        // Add all file types to beginning of form for easy access
        if (isFile) {
          temp = [this.schema[i]].concat(temp);
        } else {
          temp.push(this.schema[i]);
        }
      }
    }
    this.schema = temp;
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
</style>

<!-- Global style -->
<style>
.prof-side-view-input-wrapper {
  flex: 100%;
  margin-bottom: 6px;
}
</style>
