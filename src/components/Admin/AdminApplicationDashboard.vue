<template>
  <div>
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
    <v-data-table
      :headers="headers"
      v-model="selected"
      :items="applications"
      :single-select="false"
      item-key="test"
      show-select
      :search="search"
      class="elevation-1"
    />
  </div>
</template>

<script>
import { db } from "@/firebase/init";
export default {
  name: "AdminApplicationDashboard",
  components: {},
  data() {
    return {
      applications: [],
      selected: null,
      search: "",
      headers: [{ text: "test", value: "test" }],
      applicationTypes: ["Fellowship", "Justice Media Co-Lab"]
    };
  },
  methods: {},
  async mounted() {
    const ref = db.collection("testApplication").doc("Fall 2021");
    for (let type of this.applicationTypes) {
      const subCol = await ref.collection(type).get();
      subCol.forEach(element => {
        this.applications.push(element.data());
      });
    }
  }
};
</script>
