<template>
  <v-layout>
    <v-container>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Status</span>
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
                        <v-radio label="Under Review" :value="2"></v-radio>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">
                        <svg height="30" width="50">
                          <circle cx="20" cy="20" r="10" fill="yellow" />
                        </svg>
                      </td>
                      <td class="text-center">
                        <v-radio label="Reviewed" :value="3"></v-radio>
                      </td>
                    </tr>

                    <tr>
                      <td class="text-center">
                        <svg height="30" width="50">
                          <circle cx="20" cy="20" r="10" fill="green" />
                        </svg>
                      </td>
                      <td class="text-center">
                        <v-radio label="Accepted" :value="5"></v-radio>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">
                        <svg height="30" width="50">
                          <circle cx="20" cy="20" r="10" fill="red" />
                        </svg>
                      </td>
                      <td class="text-center">
                        <v-radio label="Rejected" :value="6"></v-radio>
                      </td>
                    </tr>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>

            <v-container v-else-if="editNotes">
              <v-textarea v-model="editItem.notes" />
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
          <v-flex mx-1>
            <v-select
              :items="positionList"
              v-model="position"
              label="Position"
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
        <template v-slot:item.status="{ item }">
          <button @click="editApplication(item, 'status')">
            {{ getStatus(item.status) }}
          </button>
        </template>

        <template v-slot:item.notes="{ item }">
          <button @click="editApplication(item, 'notes')">
            {{ item.notes }}
          </button>
        </template>
      </v-data-table>
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
      schema: null,
      editStatus: false,
      editNotes: false,
      editIndex: null,
      editItem: null,
      dialog: false,
      applications: [],
      selected: null,
      positionList: [
        "team lead",
        "ux designer",
        "frontend developer",
        "backend developer"
      ],
      position: [],
      programList: [
        "X-Lab",
        "Innovation Fellow",
        "Co-Lab",
        "Student Employment"
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
        { text: "Test", value: "test" },
        { text: "Name", value: "name" },
        {
          text: "Position",
          value: "position",
          filter: value => {
            if (this.position.length == 0) return true;
            return this.position.includes(value.toLowerCase());
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
        { text: "Year", value: "year" },
        { text: "Gender", value: "gender" },
        { text: "Email", value: "Email" },
        {
          text: "Status",
          value: "status",
          filter: value => {
            if (this.status.length == 0) return true;
            return this.status.includes(this.statusList[value]);
          }
        },
        { text: "Notes", value: "notes" },
        {}
      ]
    };
  },
  methods: {
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
      // if (this.editItem.status == 2) {
      //   // rejectMentor
      //   const user = db.collection("users").doc(this.editItem.uid);
      //   const application = db.collection("mentors").doc(this.editItem.uid);
      //   await user.update({
      //     applicationStatus: 2
      //   });
      //   await application.update({
      //     status: 2
      //   });
      //   Object.assign(this.data[this.editIndex], this.editItem);
      //   this.close();
      // } else if (this.editItem.status == 4) {
      //   // acceptMentor
      //   const user = db.collection("users").doc(this.editItem.uid);
      //   const application = db.collection("mentors").doc(this.editItem.uid);
      //   await user.update({
      //     applicationStatus: 4
      //   });
      //   await application.update({
      //     status: 4
      //   });
      //   Object.assign(this.data[this.editIndex], this.editItem);
      //   this.close();
      // } else {
      //   this.close();
      // }

      Object.assign(this.applications[this.editIndex], this.editItem);
      this.close();
    },
    getStatus(status) {
      if (status == 0) {
        return "started";
      }
      if (status == 1) {
        return "submitted";
      }
      if (status == 2) {
        return "under review";
      }
      if (status == 3) {
        return "reviewed";
      }
      if (status == 4) {
        return "interviewing";
      }
      if (status == 5) {
        return "accepted";
      }
      if (status == 6) {
        return "rejcted";
      }
      if (status == 7) {
        return "declined";
      }
    }
  },
  async mounted() {
    const ref = db.collection("testApplication").doc("Fall 2021");
    for (let type of this.programList) {
      const subCol = await ref.collection(type).get();
      subCol.forEach(element => {
        this.applications.push(element.data());
      });
    }
  }
};
</script>
