<template>
  <div>
    <v-layout row>
      <v-flex mt-3 xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar color="teal" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Manage Application Forms</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <v-list-group
              v-for="item in programList"
              v-model="item.active"
              :key="item"
              :prepend-icon="item.action"
              no-action
              @input="onItemClick($event, item.id)"
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.id }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <!-- <v-list-tile-action>
                  <h4>{{ item }}</h4>>
                </v-list-tile-action> -->
              <v-list-tile
                v-for="semester in Object.keys(Object.assign({}, ...item.data))"
                :key="semester"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    <v-btn
                      color="#36bd90"
                      class="ma-4"
                      @click="
                        applicationForm(
                          item.id,
                          semester,
                          item.data[semester]['schema']
                        )
                      "
                      rounded
                    >
                      {{ semester }}
                    </v-btn>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
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
      selected: ""
    };
  },
  computed: {},
  methods: {
    onItemClick(event, item) {
      if (event) {
        this.selected = item;
      }
    },
    applicationForm(applicationType, semester, schema) {
      this.$router.push({
        name: "applicationForm",
        params: {
          applicationTypeFromList: applicationType,
          semesterFromList: semester,
          schemaList: schema
        }
      });
    }
  },
  async mounted() {
    const ref = db.collection("applicationTemplate");
    const snapshot = await ref.get();
    snapshot.forEach(doc => {
      this.programList.push({
        id: doc.id,
        data: doc.data()
      });
    });
    console.log(this.programList);
  }
};
</script>
