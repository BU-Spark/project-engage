<template>
  <div>
    <v-layout>
      <v-flex mt-3 mb-6 xs12 sm12>
        <v-card>
          <v-toolbar color="teal" dark @click="toggle">
            <v-toolbar-title>Manage Application Forms</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list v-if="this.expand">
            <v-list-group
              v-for="item in programList"
              v-model="item.active"
              :key="item.id"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="text-left"
                    >{{ item.id }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-item-group multiple>
                <v-layout align-end>
                  <v-item v-for="semester in item.data" :key="semester[0]">
                    <v-btn
                      color="#36bd90"
                      class="ma-4"
                      @click="
                        applicationForm(
                          item.id,
                          semester[0],
                          semester[1]['schema'],
                          semester[1]['deadline'],
                          semester[1]['description']
                        )
                      "
                      rounded
                    >
                      {{ semester[0] }}
                    </v-btn>
                  </v-item>
                </v-layout>
              </v-item-group>
            </v-list-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="mx-2">
          Add Application
        </v-btn>
      </template>
      <v-overlay v-if="submitting" :absolute="absolute" :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
          color="green"
        ></v-progress-circular>
      </v-overlay>
      <v-card>
        <v-card-title class="text-h5 lighten-2"> Add Application </v-card-title>
        <v-select
          :items="programList"
          item-text="id"
          v-model="application"
          label="Choose an application type"
          outlined
          v-on:change="defineSemList"
        ></v-select>
        <v-select
          :items="semList"
          v-model="semester"
          label="Choose a semester to duplicate template from"
          outlined
        ></v-select>
        <v-text-field
          outlined
          v-model="newSemester"
          label="New Semester Name"
          placeholder="for example: Spring 2021 / Summer 2021 / Fall 2021"
        ></v-text-field>
        <v-alert dark v-if="errorMsg"> {{ errorMsg }} </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel"> Cancel </v-btn>
          <v-btn color="primary" text @click="submit('app')"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="templateDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="mx-2">
          Add Application Template
        </v-btn>
      </template>
      <v-overlay v-if="submitting" :absolute="absolute" :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
          color="green"
        ></v-progress-circular>
      </v-overlay>
      <v-card>
        <v-card-title class="text-h5 lighten-2">
          Add Application Template</v-card-title
        >
        <v-text-field
          outlined
          v-model="application"
          label="New Application Template Name"
          placeholder="for example: Best Internship"
        ></v-text-field>

        <!-- <v-select
          :items="semList"
          v-model="semester"
          label="Choose a semester to duplicate template from"
          outlined
        ></v-select>  -->
        <v-text-field
          outlined
          v-model="newSemester"
          label="New Semester Name"
          placeholder="for example: Spring 2021 / Fall 2021/ Template"
        ></v-text-field>
        <v-alert dark v-if="errorMsg"> {{ errorMsg }} </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel"> Cancel </v-btn>
          <v-btn color="primary" text @click="submit('template')">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase/init";

export default {
  name: "applicationFormListDisplay",
  components: {},
  data() {
    return {
      programList: [],
      expand: true,
      dialog: false,
      application: null,
      applicationIndex: null,
      semester: null,
      semList: [],
      newSemester: null,
      schema: null,
      errorMsg: null,
      programName: null,
      templateDialog: false,
      submitting: false
    };
  },
  computed: {},
  methods: {
    toggle() {
      this.expand = !this.expand;
    },
    applicationForm(applicationType, semester, schema, deadline, description) {
      this.$router.push({
        name: "applicationForm",
        params: {
          applicationTypeFromList: applicationType,
          semesterFromList: semester,
          schemaList: schema,
          deadline: deadline,
          description: description
        }
      });
    },
    defineSemList() {
      this.semester = null;
      this.semList = [];
      for (var i = 0; i < this.programList.length; i++) {
        if (this.programList[i].id === this.application) {
          this.applicationIndex = i;
          for (var j = 0; j < this.programList[i].data.length; j++) {
            this.semList.push(this.programList[i].data[j][0]);
          }
        }
      }
    },
    cancel() {
      this.dialog = false;
      this.application = null;
      this.applicationIndex = null;
      this.semester = null;
      this.semList = [];
      this.newSemester = null;
      this.schema = null;
      this.errorMsg = null;
      this.templateDialog = false;
    },
    async submit(type) {
      //if adding to a new existing application - check previous schema
      const template = db
        .collection("applicationTemplate")
        .doc(this.application);
      if (type == "app") {
        if (
          this.application == null ||
          this.semester == null ||
          this.newSemester == null
        ) {
          this.errorMsg = "Please enter all fields";
        } else if (this.application == "Base") {
          this.errorMsg = "Cannot duplicate Base Application";
        } else {
          this.submitting = true;
          for (
            var i = 0;
            i < this.programList[this.applicationIndex].data.length;
            i++
          ) {
            if (
              this.programList[this.applicationIndex].data[i][0] ==
              this.semester
            ) {
              this.schema = this.programList[this.applicationIndex].data[
                i
              ][1].schema;
            }
          }
        }
        await template
          .update({
            [`${this.newSemester}.schema`]: this.schema,
            [`${this.newSemester}.deadline`]: "",
            [`${this.newSemester}.description`]: ""
          })
          .then(() => {
            console.log("submitted");
          })
          .catch(error => {
            console.log(error);
          });
      }
      //adding a new progam application template
      else {
        if (this.application == null || this.newSemester == null) {
          this.errorMsg = "Please enter all fields";
        } else {
          this.submitting = true;
          this.schema = [{ label: "Section 1", name: "Section 1", type: "hr" }];
        }
        await template
          .set({
            [`${this.newSemester}`]: {
              deadline: "",
              description: "",
              schema: this.schema
            }
          })
          .then(() => {
            console.log("submitted");
          })
          .catch(error => {
            console.log(error);
          });
      }
      // this.programList[this.applicationIndex].data.push([
      //     this.newSemester, {
      //         [`${this.newSemester}.schema`]: this.schema,
      //         [`${this.newSemester}.deadline`]: ""
      //     }
      // ]);

      location.reload();
    }
  },
  async mounted() {
    const ref = db.collection("applicationTemplate");
    const snapshot = await ref.get();
    snapshot.forEach(doc => {
      this.programList.push({
        id: doc.id,
        data: Object.entries(doc.data())
      });
    });
  }
};
</script>
