<!-- This template display the selected student application on the admin side -->
<template>
  <div class="doc-wrapper">
    <div class="print-button-wrapper">
      <v-btn color="primary" @click="showPrintWindow" class="no-print">
        Print / Save as PDF
      </v-btn>
    </div>
    <div class="doc-letter-size">
      <div style="border: dashed orangered 2px; padding: 4px;" class="no-print">
        Page Size: Letter (8.5" x 11")
      </div>
      <h3 style="text-align: center">Student Application</h3>
      <div v-if="information.length > 0">
        <v-row>
          <v-col>
            <h4>Basic Info</h4>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <template v-for="header in headers">
                    <tr
                      v-if="header.value in information[0]"
                      :key="header.value"
                    >
                      <td style="font-weight: bold">{{ header.text }}</td>
                      <td>{{ information[0][header.value] }}</td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </div>

      <div v-for="(sectionTitle, sectionId) in steps" :key="sectionId">
        <v-row>
          <v-col>
            <h4>{{ sectionTitle }}</h4>
          </v-col>
        </v-row>
        <div class="app-section-wrapper">
          <template v-for="(schemaItem, schemaItemId) in schemaList[sectionId]">
            <v-row
              v-if="schemaItem.type !== 'submit'"
              :key="schemaItemId"
              style="border-bottom: thin solid rgba(0, 0, 0, 0.12); break-inside: avoid-page;"
            >
              <v-col>
                <v-row>
                  <v-col>
                    <div class="item-title">
                      <div class="item-title-id">{{ schemaItemId + 1 }}</div>
                      <div>{{ schemaItem.label }}</div>
                    </div>
                    <div class="item-content">
                      <div
                        v-if="
                          typeof values[schemaItem.name] === 'string' &&
                            values[schemaItem.name] !== ''
                        "
                      >
                        <span v-if="isUrl(values[schemaItem.name])">
                          <a :href="values[schemaItem.name]" target="_blank">{{
                            values[schemaItem.name]
                          }}</a>
                        </span>
                        <span v-else>
                          {{ values[schemaItem.name] }}
                        </span>
                      </div>
                      <div
                        v-else-if="
                          typeof values[schemaItem.name] === 'object' &&
                            values[schemaItem.name].length > 0
                        "
                      >
                        <template v-for="item in values[schemaItem.name]">
                          <v-chip
                            v-if="typeof item === 'string'"
                            :key="item"
                            style="margin:4px; max-width: 90%; white-space: normal; height: auto;"
                            color="indigo darken-3"
                            outlined
                          >
                            {{ item }}
                          </v-chip>
                          <div
                            v-else-if="typeof item === 'object'"
                            :key="JSON.stringify(item)"
                          >
                            <a :href="item.url" target="_blank">
                              {{ item.name }}
                            </a>
                          </div>
                        </template>
                      </div>
                      <div v-else style="color: grey; font-style: italic;">
                        N/A
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </div>
      </div>
      <h2 v-if="this.schema.length == 0" style="margin: 10px;">
        Loading data...
      </h2>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";

export default {
  name: "StudentApplicationExport",
  // props: ["item"],
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
      steps: ["Test"], // set dummy value to allow first section to open automatically
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
    showPrintWindow() {
      window.print();
    },
    isUrl(str) {
      const re = /^(https?):\/\/[^\s$.?#].[^\s]*$/gm;
      return !!str.match(re);
    }
  },
  async mounted() {
    let params = JSON.parse(localStorage["params"]);
    this.item = params["item"];
    //gather basic user information
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
    this.values = this.item;

    // grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.item.program);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    if (
      template[this.item.semester] &&
      template[this.item.semester]["schema"]
    ) {
      this.schema = template[this.item.semester]["schema"];
      var temp = [];
      for (let i = 0; i < this.schema.length; i++) {
        if (this.schema[i]["type"] == "hr") {
          this.schemaList.push(temp);
          this.steps.push(this.schema[i]["label"]);
          temp = [];
        } else if (
          this.item.status == 1 &&
          this.schema[i]["type"] == "submit"
        ) {
          // don't add the save button
        } else if (this.schema[i]["type"] == "file") {
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
          temp.push(this.schema[i]);
        } else {
          temp.push(this.schema[i]);
        }
      }
      this.schemaList.push(temp);
      this.schemaList = this.schemaList.filter(e => e.length);
      this.steps.shift(); // delete the dummy value
    }

    // Update the title after loaded
    document.title =
      this.item.firstname +
      " " +
      this.item.lastname +
      " - " +
      this.item.program;

    this.$nextTick(() => {
      // Show Print Window after loaded
      this.showPrintWindow();
    });
  }
};
</script>

<style scoped>
.print-button-wrapper {
  position: absolute;
  right: 16px;
  top: 16px;
}

.doc-wrapper {
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.doc-letter-size {
  width: 8.5in;

  text-align: left;
}

.app-section-wrapper {
  padding: 0 0.1in 0 0.1in;
}

.item-title {
  display: flex;
  flex-direction: row;
  font-weight: bold;
}

.item-title-id {
  width: 0.3in;
  min-width: 0.3in;
  text-align: right;
  padding-right: 0.1in;
}

.item-content {
  padding: 0.1in 0.3in;
}

@media print {
  .no-print {
    display: none;
  }
}
</style>
