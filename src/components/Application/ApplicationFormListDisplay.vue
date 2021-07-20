<template>
  <div>
    <v-layout>
      <v-flex mt-3 xs12 sm6 offset-sm3>
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
                  <v-list-item-title class="text-left">{{
                    item.id
                  }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-item-group multiple>
                <v-item v-for="semester in item.data" :key="semester[0]">
                  <v-btn
                    color="#36bd90"
                    class="ma-4"
                    @click="
                      applicationForm(
                        item.id,
                        semester[0],
                        semester[1]['schema']
                      )
                    "
                    rounded
                  >
                    {{ semester[0] }}
                  </v-btn>
                </v-item>
              </v-item-group>
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
      expand: false
    };
  },
  computed: {},
  methods: {
    toggle() {
      this.expand = !this.expand;
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
        data: Object.entries(doc.data())
      });
    });
    console.log(this.programList);
  }
};
</script>
