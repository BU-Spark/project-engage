<!-- route: /studentApplications -->
<template>
  <div>
    <AdminNavbar />
    <v-main>
      <v-container fluid class="px-16 align-center">
        <template>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span v-if="editStatus" class="headline">Status</span>
                <span v-else-if="editNotes" class="headline">Notes</span>
              </v-card-title>

              <v-card-text>
                <v-container v-if="editStatus">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-radio-group v-if="editItem" v-model="editItem.status">
                        <tr>
                          <td class="text-center">
                            <svg height="30" width="50">
                              <circle cx="20" cy="20" r="10" fill="orange" />
                            </svg>
                          </td>
                          <td class="text-center">
                            <v-radio
                              label="Under Review"
                              value="Interviewing"
                            ></v-radio>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <svg height="30" width="50">
                              <circle cx="20" cy="20" r="10" fill="yellow" />
                            </svg>
                          </td>
                          <td class="text-center">
                            <v-radio
                              label="Interviewed"
                              value="Interviewed"
                            ></v-radio>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <svg height="30" width="50">
                              <circle cx="20" cy="20" r="10" fill="green" />
                            </svg>
                          </td>
                          <td class="text-center">
                            <v-radio
                              label="Accepted"
                              value="Accepted"
                            ></v-radio>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <svg height="30" width="50">
                              <circle cx="20" cy="20" r="10" fill="red" />
                            </svg>
                          </td>
                          <td class="text-center">
                            <v-radio
                              label="Rejected"
                              value="Rejected"
                            ></v-radio>
                          </td>
                        </tr>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container v-else-if="editNotes">
                  <v-textarea v-model="editItem.adminNotes" />
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row>
            <v-col md="dataTableCols">
              <v-row style="margin-top: 6px; margin-bottom: 6px;">
                <v-card-title>
                  Submitted Applications
                </v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  class="float-right pr-4"
                ></v-text-field>
              </v-row>

              <v-row class="px-3">
                <v-flex mx-1>
                  <v-select
                    label="Semester"
                    :value="chosenSemester"
                    @input="setChosenSemester"
                    :items="semester"
                    multiple
                    hide-details
                    class="pt-0 pb-6"
                  ></v-select>
                </v-flex>
                <v-flex mx-1>
                  <v-select
                    label="Program"
                    :value="chosenProgram"
                    @input="setChosenProgram"
                    :items="programList"
                    multiple
                    hide-details
                    class="pt-0 pb-6"
                  ></v-select>
                </v-flex>
                <v-flex mx-1>
                  <v-select
                    label="Status"
                    :value="chosenStatus"
                    @input="setChosenStatus"
                    :items="statusList"
                    :menu-props="{ maxHeight: '400' }"
                    multiple
                    hide-details
                    class="pt-0 pb-6"
                  ></v-select>
                </v-flex>
              </v-row>

              <!-- Table where all applications are displayed -->
              <v-data-table
                v-model="selected"
                :headers="selectedHeaders"
                :items="applications"
                item-key="uid"
                show-select
                show-expand
                :single-expand="true"
                :single-select="false"
                :search="search"
                class="elevation-1 v-data-table-reduced mt-3"
                @click:row="handleRowClick"
              >
                <template v-slot:item.firstname="{ item }">
                  <button @click="viewProfile(item)" style="color: #00a99e">
                    {{ item.firstname }}
                  </button>
                </template>

                <template v-slot:item.program="{ item }">
                  <button @click="viewApplication(item)" style="color: #00a99e">
                    {{ item.program }}
                  </button>
                </template>

                <template v-slot:item.status="{ item }">
                  <button @click="editApplication(item, 'status')">
                    {{ item.status }}
                  </button>
                </template>

                <template v-slot:item.adminNotes="{ item }">
                  <button @click="editApplication(item, 'notes')">
                    {{ item.adminNotes ? item.adminNotes : "Add Notes" }}
                  </button>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <ExpandedApplication v-bind:item="item" />
                  </td>
                  <!-- <td :colspan="headers.length">
                    {{ item }}
                  </td> -->
                </template>
              </v-data-table>
            </v-col>

            <v-col md="3" v-if="profileOpen">
              <v-card class="pa-2" style="background-color: #f1f8f3">
                <ProfileSideView v-bind:profile="storedProfile" />
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-main>

    <vue-blob-json-csv
      tag-name="div"
      file-type="csv"
      file-name="sample"
      title="Export as csv"
      :data="this.toexport"
    >
      Export as csv
    </vue-blob-json-csv>
  </div>
</template>

<script>
import { db } from "@/firebase/init";
import AdminNavbar from "@/components/Admin/AdminNavbar.vue";
import ProfileSideView from "./ProfileSideView.vue";
import ExpandedApplication from "./ExpandedApplication.vue";
import VueBlobJsonCsv from "vue-blob-json-csv";
import Vue from "vue";

Vue.use(VueBlobJsonCsv);

export default {
  name: "StudentApplications",
  components: {
    AdminNavbar,
    ProfileSideView,
    ExpandedApplication
  },
  computed: {
    profileOpen() {
      return this.$store.state.profileOpen;
    },
    chosenSemester() {
      return this.$store.state.chosenSemester;
    },
    chosenProgram() {
      return this.$store.state.chosenProgram;
    },
    chosenStatus() {
      return this.$store.state.chosenStatus;
    },
    isChosenSemesterEmpty() {
      return this.$store.getters.isChosenSemesterEmpty;
    }
  },
  data() {
    return {
      value: {},
      semester1: "",
      semester2: "",
      semester3: "",
      semester: [],
      schema: null,
      editStatus: false,
      editNotes: false,
      editIndex: null,
      editItem: null,
      dialog: false,
      gridApi: null,
      applications: [],
      toexport: [],
      selected: null,
      viewStudentApplications: false,
      position: [],
      programList: [],
      statusList: [
        "started",
        "submitted",
        "under review",
        "reviewed",
        "interviewing",
        "accepted",
        "rejcted",
        "declined"
      ],
      search: "",
      dataTableCols: 12,
      storedProfile: {},
      selectedHeaders: [],
      headers: [
        {
          text: "First Name",
          value: "firstname"
        },
        {
          text: "Last Name",
          value: "lastname"
        },
        {
          text: "Semester",
          value: "semester",
          filter: value => {
            if (this.chosenSemester.length == 0) return true;
            return this.chosenSemester.includes(value);
          }
        },
        {
          text: "Program",
          value: "program",
          filter: value => {
            if (this.chosenProgram.length == 0) return true;
            return this.chosenProgram.includes(value);
          }
        },
        {
          text: "Year",
          value: "schoolYear"
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
          text: "Submission Time",
          value: "submissionTime",
          sort: (d1, d2) => {
            if (d1 == null) {
              return 1;
            }
            if (d2 == null) {
              return -1;
            }
            var da1 = new Date(d1);
            var da2 = new Date(d2);
            var date1 = Date.UTC(
              da1.getUTCFullYear(),
              da1.getUTCMonth(),
              da1.getUTCDate(),
              da1.getUTCHours(),
              da1.getUTCMinutes(),
              da1.getUTCSeconds()
            );
            var date2 = Date.UTC(
              da2.getUTCFullYear(),
              da2.getUTCMonth(),
              da2.getUTCDate(),
              da2.getUTCHours(),
              da2.getUTCMinutes(),
              da2.getUTCSeconds()
            );
            return date2 - date1;
          }
        },
        {
          text: "Status",
          value: "status",
          filter: value => {
            if (this.chosenStatus.length == 0) return true;
            if (value) {
              return this.chosenStatus.includes(value);
            }
          }
        },
        {
          text: "Notes",
          value: "adminNotes"
        }
      ],
      reducedHeaders: [
        {
          text: "First Name",
          value: "firstname",
          width: "50px"
        },
        {
          text: "Last Name",
          value: "lastname",
          width: "50px"
        },
        {
          text: "Semester",
          value: "semester",
          filter: value => {
            if (this.chosenSemester.length == 0) return true;
            return this.chosenSemester.includes(value);
          }
        },
        {
          text: "Program",
          value: "program",
          width: "150px",
          filter: value => {
            if (this.chosenProgram.length == 0) return true;
            return this.chosenProgram.includes(value);
          }
        },
        {
          text: "Year",
          value: "schoolYear"
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
          text: "Submission Time",
          value: "submissionTime",
          sort: (d1, d2) => {
            if (d1 == null) {
              return 1;
            }
            if (d2 == null) {
              return -1;
            }
            var da1 = new Date(d1);
            var da2 = new Date(d2);
            var date1 = Date.UTC(
              da1.getUTCFullYear(),
              da1.getUTCMonth(),
              da1.getUTCDate(),
              da1.getUTCHours(),
              da1.getUTCMinutes(),
              da1.getUTCSeconds()
            );
            var date2 = Date.UTC(
              da2.getUTCFullYear(),
              da2.getUTCMonth(),
              da2.getUTCDate(),
              da2.getUTCHours(),
              da2.getUTCMinutes(),
              da2.getUTCSeconds()
            );
            return date2 - date1;
          }
        },
        {
          text: "Status",
          value: "status",
          filter: value => {
            if (this.chosenStatus.length == 0) return true;
            if (value) {
              return this.chosenStatus.includes(value);
            }
          }
        }
      ]
    };
  },
  methods: {
    async getListOfApplicationTemplateTypes() {
      var outputList = [];
      const snapshot = await db.collection("applicationTemplate").get();
      snapshot.forEach(doc => {
        if (doc.id != "Base") {
          outputList.push(doc.id);
        }
      });
      return outputList;
    },
    setChosenSemester(val) {
      this.$store.commit("setChosenSemester", val);
    },
    setChosenProgram(val) {
      this.$store.commit("setChosenProgram", val);
    },
    setChosenStatus(val) {
      this.$store.commit("setChosenStatus", val);
    },
    back() {
      this.$router.go(-1);
    },
    handleRowClick(row) {
      this.$store.commit("openProfile");
      this.storedProfile = row;
    },
    viewProfile(item) {
      let route = this.$router.resolve({
        name: "studentProfile"
      });
      window.localStorage["params"] = JSON.stringify({
        item: item
      });
      window.open(route.href, "_self");
      this.item = item;
    },
    viewApplication(item) {
      let route = this.$router.resolve({
        name: "studentApp"
      });
      window.localStorage["params"] = JSON.stringify({
        item: item
      });
      window.open(route.href, "_self");
      this.item = item;
    },
    editApplication(item, field) {
      if (field == "notes") {
        this.editNotes = true;
        this.editStatus = false;
      } else if (field == "status") {
        this.editNotes = false;
        this.editStatus = true;
      }
      this.editIndex = this.applications.indexOf(item);
      this.editItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.editNotes = false;
      this.editStatus = false;
      this.editItem = null;
      this.editIndex = null;
    },
    async save() {
      //might chage base on how the application is submitted on the student side.

      //save admin notes on application
      if (this.editNotes) {
        console.log(this.editItem);
        const ref = db.collection("applications").doc(this.editItem.semester);
        const application = await ref
          .collection(this.editItem.program)
          .doc(this.editItem.uid);
        await application.update({
          adminNotes: this.editItem.adminNotes
        });
        Object.assign(this.applications[this.editIndex], this.editItem);
        //save application status
      } else if (this.editStatus) {
        if (this.editItem.status) {
          const userRef = await db.collection("users").doc(this.editItem.uid);
          const userDoc = await userRef.get();
          let apps = userDoc.data().applications;
          let semGroup = apps[this.editItem.semester];
          for (let app of semGroup) {
            if (app.type == this.editItem.program) {
              app.status = this.editItem.status;
              break;
            }
          }
          await userRef.update({
            applications: apps
          });
          Object.assign(this.applications[this.editIndex], this.editItem);
        }
      }
      this.close();
    },
    getSemesters() {
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      //checking for which semester to include on the application table. NOTE: Only display 3 semesters at a time
      if (month >= 7 && month <= 11) {
        this.semester1 = "Fall " + year;
        this.semester2 = "Spring " + (year + 1);
        this.semester3 = "Summer " + (year + 1);
      } else if (month >= 0 && month <= 4) {
        this.semester1 = "Spring " + year;
        this.semester2 = "Summer " + year;
        this.semester3 = "Fall " + year;
      } else {
        this.semester1 = "Summer " + year;
        this.semester2 = "Fall " + year;
        this.semester3 = "Spring " + (year + 1);
      }
      this.semester = [
        this.semester1,
        this.semester2,
        this.semester3,
        "Ongoing"
      ];
    },
    export_csv() {
      var count = Object.keys(this.applications).length;
      this.toexport = [];
      for (var i = 0; i < count; i++) {
        var dict = {};
        dict["First Name"] = this.applications[i].firstname;
        dict["Last Name"] = this.applications[i].lastname;
        dict["Semester"] = this.applications[i].semester;
        dict["Program"] = this.applications[i].program;
        dict["Year"] = this.applications[i].schoolYear;
        dict["gender"] = this.applications[i].gender;
        dict["email"] = this.applications[i].email;
        dict["Submission time"] = this.applications[i].submissionTime;
        dict["Status"] = this.applications[i].status;
        dict["Notes"] = this.applications[i].adminNotes;
        this.toexport.push(dict);
      }
      console.log(this.toexport);
    }
  },
  async mounted() {
    // Updated the chosen semesters
    this.getSemesters();
    // Reference to the document "Base" which includes all user profiles
    const profileRef = db.collection("applications").doc("Base");
    this.programList = await this.getListOfApplicationTemplateTypes();

    // Get all profiles and applications relevant to the chosen semesters in order to display them
    for (let sem of this.semester) {
      const semesterRef = db.collection("applications").doc(sem);

      // Go through each of the programs offered in a semester
      for (let program of this.programList) {
        const subCol = await semesterRef.collection(program).get();
        // Get applications for each user id found in the program subcollection
        subCol.forEach(async element => {
          const user = await db
            .collection("users")
            .doc(element.id)
            .get();
          const applications = await user.data().applications[sem];
          let submissionTime;
          let status;
          let result;
          if (applications) {
            for (let app of applications) {
              // If statemnt is for optimization, so we dont go over the same application multiple times
              if (app.type == program) {
                submissionTime = app.submissionTime;
                submissionTime = new Date(
                  submissionTime.seconds * 1000
                ).toLocaleString("en-US", {
                  timeZone: "America/New_York"
                });
                status = app.status;
              }
            }
          }
          //find the profle applications for included applications users
          let profCol = await profileRef
            .collection("All")
            .doc(element.id)
            .get();

          if (profCol.data()) {
            result = { ...profCol.data() };
          }
          result = {
            ...result,
            ...element.data(),
            ...{
              uid: element.id,
              semester: sem,
              submissionTime: submissionTime,
              status: status
            }
          };
          //save all applications to an array to be be displayed on the datatable
          this.applications.push(result);

          this.export_csv();
        });
      }
    }
  },
  watch: {
    profileOpen(val) {
      if (val) {
        this.selectedHeaders = this.reducedHeaders;
        this.dataTableCols = 9;
      } else {
        this.selectedHeaders = this.headers;
        this.dataTableCols = 12;
      }
    }
  },
  created() {
    this.selectedHeaders = this.headers;
    this.$store.commit("closeProfile");
  }
};
</script>

<!-- Global css (I needed to use this in order to make changes would otherwise be difficult) -->
<style>
.v-data-table-header th {
  white-space: nowrap;
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.v-data-table-reduced td {
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.v-data-table__expand-icon {
  margin-left: 10px;
  margin-right: 10px;
}

.v-simple-checkbox {
  margin-right: 14px;
}

.v-data-table__wrapper {
  margin-left: 6px;
  margin-right: 6px;
}
</style>
