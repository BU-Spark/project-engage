<template>
  <v-layout align-center justify-center>
    <v-container>
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
                          <v-radio label="Accepted" value="Accepted"></v-radio>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          <svg height="30" width="50">
                            <circle cx="20" cy="20" r="10" fill="red" />
                          </svg>
                        </td>
                        <td class="text-center">
                          <v-radio label="Rejected" value="Rejected"></v-radio>
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
        <v-card-title>
          Submitted Applications
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <div>
          <v-row>
            <!-- <v-flex mx-1>
              <v-select
                :items="positionList"
                v-model="position"
                label="Position"
                multiple
              ></v-select>
            </v-flex> -->
            <v-flex mx-1>
              <v-select
                :items="semester"
                v-model="chosenSemester"
                label="Semester"
                multiple
              ></v-select>
            </v-flex>
            <v-flex mx-1>
              <v-select
                :items="programList"
                v-model="program"
                label="Program"
                multiple
              ></v-select>
            </v-flex>
            <v-flex mx-1>
              <v-select
                v-model="status"
                label="Status"
                :items="statusList"
                :menu-props="{ maxHeight: '400' }"
                multiple
              ></v-select>
            </v-flex>
          </v-row>
        </div>
        <v-data-table
          :headers="headers"
          v-model="selected"
          :items="applications"
          :single-select="false"
          item-key="test"
          show-select
          :search="search"
          class="elevation-1"
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
        </v-data-table>
      </template>
    </v-container>
  </v-layout>
</template>

<script>
import { db } from "@/firebase/init";
export default {
  name: "AdminApplicationDashboard",
  components: {},
  data() {
    return {
      value: {},
      semester1: "",
      semester2: "",
      semester3: "",
      semester: "",
      schema: null,
      editStatus: false,
      editNotes: false,
      editIndex: null,
      editItem: null,
      dialog: false,
      applications: [],
      selected: null,
      chosenSemester: [],
      viewStudentApplications: false,
      positionList: [
        "team lead",
        "ux designer",
        "frontend developer",
        "backend developer"
      ],
      position: [],
      programList: [
        "Employment Opportunities",
        "Innovation Fellowship | Innovator",
        "Innovation Fellowship | Technical Teammate",
        "Innovation Fellowship | UX Designer",
        "Justice Media Co-Lab",
        "X-Lab"
      ],
      program: [],
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
      status: [],
      search: "",
      headers: [
        {
          text: "First Name",
          value: "firstname"
        },
        {
          text: "last Name",
          value: "lastname"
        },
        // {
        //   text: "Position",
        //   value: "position",
        //   filter: value => {
        //     if (this.position.length == 0) return true;
        //     return this.position.includes(value.toLowerCase());
        //   }
        // },
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
            if (this.program.length == 0) return true;
            return this.program.includes(value);
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
          text: "Submisson Time",
          value: "submissionTime"
        },
        {
          text: "Status",
          value: "status",
          filter: value => {
            if (this.status.length == 0) return true;
            console.log(this.status);
            if (value) {
              return this.status.includes(value);
            }
          }
        },
        {
          text: "Notes",
          value: "adminNotes"
        },
        {}
      ]
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    viewProfile(item) {
      let route = this.$router.resolve({
        name: "studentProfile"
      });
      window.localStorage["params"] = JSON.stringify({
        item: item
      });
      window.open(route.href, "_blank");
      this.item = item;
    },
    viewApplication(item) {
      let route = this.$router.resolve({
        name: "studentApp"
      });
      window.localStorage["params"] = JSON.stringify({
        item: item
      });
      window.open(route.href, "_blank");
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
      } else if (this.editStatus) {
        if (this.editItem.status) {
          const ref = await db.collection("users").doc(this.editItem.uid);
          let applications = await ref.get();
          applications = applications.data().applications[
            this.editItem.semester
          ];
          for (let i = 0; i < applications.length; i++) {
            if (applications[i].type == this.editItem.program) {
              applications[i].status = this.editItem.status;
            }
          }
          await ref.update({
            applications: applications
          });
          Object.assign(this.applications[this.editIndex], this.editItem);
        }
      }

      this.close();
    }
  },
  async mounted() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    if (month >= 7 && month <= 11) {
      this.semester1 = "Fall " + year;
      this.semester2 = "Spring " + (year + 1);
      this.semester3 = "Summer" + (year + 1);
    } else if (month >= 0 && month <= 4) {
      this.semester1 = "Spring " + year;
      this.semester2 = "Summer " + year;
      this.semester3 = "Fall " + year;
    } else {
      this.semester1 = "Summer " + year;
      this.semester2 = "Fall " + year;
      this.semester3 = "Spring " + year;
    }
    this.semester = [this.semester1, this.semester2, this.semester3];
    for (let i = 0; i < this.semester.length; i++) {
      const ref = db.collection("applications").doc(this.semester[i]);
      const profileRef = db.collection("applications").doc("Base");
      for (let type of this.programList) {
        const subCol = await ref.collection(type).get();
        subCol.forEach(async element => {
          const user = await db
            .collection("users")
            .doc(element.id)
            .get();
          const applications = user.data().applications[this.semester[i]];
          let submissionTime;
          let status;
          let result;
          if (applications) {
            for (let i = 0; i < applications.length; i++) {
              if (applications[i].type == type) {
                submissionTime = applications[i].submissionTime;
                submissionTime = new Date(
                  submissionTime.seconds * 1000
                ).toLocaleString("en-US", {
                  timeZone: "America/New_York"
                });
                status = applications[i].status;
              }
            }
          }
          let profCol = await profileRef
            .collection("All")
            .doc(element.id)
            .get();
          if (profCol.data()) {
            result = {
              ...profCol.data(),
              ...element.data()
            };
            result = {
              ...result,
              ...{
                uid: element.id,
                semester: this.semester[i],
                submissionTime: submissionTime,
                status: status
              }
            };
            this.applications.push(result);
          } else {
            result = {
              ...element.data(),
              ...{
                uid: element.id,
                semester: this.semester[i],
                submissionTime: submissionTime,
                status: status
              }
            };
            this.applications.push(result);
          }
        });
      }
    }
  }
};
</script>
