<template>
  <div>
    <v-data-table
      :headers="headers"
      v-model="selected"
      :items="masterApplications"
      :single-select="true"
      item-key="name"
      show-select
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
      applications: { masterApplications: [] },
      selected: null,
      headers: [{ text: "test", value: "test" }],
      applicationTypes: ["Fellowship", "Justice Media Co-Lab"]
    };
  },
  methods: {},
  async mounted() {
    const ref = db.collection("testApplication").doc("Fall 2021");
    for (let type of this.applicationTypes) {
      this.applications[type] = [];
      const subCol = await ref.collection(type).get();
      subCol.forEach(element => {
        console.log(element);
        this.applications.masterApplications.push(element.data());
        this.applications[type].push(element.data());
      });
    }
  }
};
</script>
