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
                          semester[1]['deadline']
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
        <v-btn v-bind="attrs" v-on="on"> Add Application </v-btn>
      </template>

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
          <v-btn color="primary" text @click="submit"> Confirm </v-btn>
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
      errorMsg: null
    };
  },
  computed: {},
  methods: {
    toggle() {
      this.expand = !this.expand;
    },
    applicationForm(applicationType, semester, schema, deadline) {
      this.$router.push({
        name: "applicationForm",
        params: {
          applicationTypeFromList: applicationType,
          semesterFromList: semester,
          schemaList: schema,
          deadline: deadline
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
    },
    async submit() {
      if (
        this.application == null ||
        this.semester == null ||
        this.newSemester == null
      ) {
        this.errorMsg = "Please enter all fields";
      } else if (this.application == "Base") {
        this.errorMsg = "Cannot duplicate Base Application";
      } else {
        for (
          var i = 0;
          i < this.programList[this.applicationIndex].data.length;
          i++
        ) {
          if (
            this.programList[this.applicationIndex].data[i][0] == this.semester
          ) {
            this.schema = this.programList[this.applicationIndex].data[
              i
            ][1].schema;
          }
        }
        // this.programList[this.applicationIndex].data.push([
        //     this.newSemester, {
        //         [`${this.newSemester}.schema`]: this.schema,
        //         [`${this.newSemester}.deadline`]: ""
        //     }
        // ]);
        const template = db
          .collection("applicationTemplate")
          .doc(this.application);
        await template
          .update({
            [`${this.newSemester}.schema`]: this.schema,
            [`${this.newSemester}.deadline`]: ""
          })
          .then(() => {
            console.log("submitted");
          })
          .catch(error => {
            console.log(error);
          });
        this.dialog = false;
        this.application = null;
        this.applicationIndex = null;
        this.semester = null;
        this.semList = [];
        this.newSemester = null;
        this.schema = null;
        this.errorMsg = null;
        location.reload();
      }
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
