<template>
  <div>
    <!-- ??? rule for file still needs fix, when delete file -->
    <template>
      <v-stepper v-model="section" vertical>
        <template v-for="(n, i) in steps">
          <v-stepper-step
            :key="`${n}-step`"
            :complete="section > n"
            :step="i"
            editable
            class="stepperColor"
          >
            {{ n }}
          </v-stepper-step>
          <v-stepper-content :key="`${n}-content`" :step="i">
            <FormulateForm
              class="form-wrapper"
              v-model="values"
              :schema="schemaList[i]"
            />
          </v-stepper-content>
        </template>
      </v-stepper>
    </template>
  </div>
</template>

<script>
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import { db, storage } from "@/firebase/init.js";
export default {
  name: "Profile",
  components: {},
  data() {
    return {
      schema: [],
      schemaList: [],
      values: null,
      steps: [],
      section: 1
    };
  },
  props: {
    formulateValue: Object
  },
  created() {},
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async submitProfile() {
      // upload firebase storage for files
      var valuesCopy = Object.assign({}, this.values);
      Object.filter = (obj, predicate) =>
        Object.keys(obj)
          .filter(key => predicate(obj[key]))
          .reduce((res, key) => ((res[key] = obj[key]), res), {});
      var filtered = Object.filter(valuesCopy, value => value["files"] != null);
      var fileElements = Object.keys(filtered);
      for (var i = 0; i < fileElements.length; i++) {
        var temp = [];
        for (var j = 0; j < filtered[fileElements[i]]["files"].length; j++) {
          var name = valuesCopy[fileElements[i]]["files"][j]["path"]["name"];
          var url = await storage
            .ref()
            .child(
              this.user.uid +
                " " +
                "Base" +
                " " +
                fileElements[i] +
                " " +
                j +
                "." +
                name.split(".").pop()
            )
            .put(valuesCopy[fileElements[i]]["files"][j]["file"])
            .then(snapshot => {
              return snapshot.ref.getDownloadURL();
            })
            .then(downloadURL => downloadURL);
          temp.push({
            name: name,
            url: url
          });
        }
        valuesCopy[fileElements[i]] = temp;
      }

      const userBaseRef = db
        .collection("applications")
        .doc("Base")
        .collection("All")
        .doc(this.user.uid);
      await userBaseRef.set(valuesCopy);
    }
  },
  async mounted() {
    const userBaseRef = db
      .collection("applications")
      .doc("Base")
      .collection("All")
      .doc(this.user.uid);
    const doc = await userBaseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
      console.log("Document data:", doc.data());
    }

    const formRef = db.collection("applicationTemplate").doc("Base");
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template["Template"]["schema"];
    var temp = [];
    for (let i = 0; i < this.schema.length; i++) {
      if (this.schema[i]["type"] == "hr") {
        this.schemaList.push(temp);
        this.steps.push(this.schema[i]["label"]);
        temp = [];
      } else {
        temp.push(this.schema[i]);
      }
    }
    this.schemaList.push(temp);
    this.schemaList = this.schemaList.filter(e => e.length);
  }
};
</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2em;
  border: 1px solid #a8a8a8;
  border-radius: 0.5em;
  box-sizing: border-box;
  color: rgb(110, 108, 108);
  background-color: rgb(229, 243, 250);
}

.test {
  display: felx;
  flex-direction: row;
  background-color: black;
}

.double-row {
  width: 700px;
  color: aqua;
}

@media (min-width: 650px) {
  .double-row {
    display: flex;
  }
}

@media (min-width: 720px) {
  .double-row {
    display: block;
  }
}

@media (min-width: 850px) {
  .double-row {
    display: flex;
  }
  .double-row .formulate-input {
    margin-right: 1.5em;
  }
}

.formulate-input {
  margin-right: 2em;
  margin-bottom: 0;
  color: black;
  background-color: white;
}

div#main-actions {
  margin-right: 25px !important;
  float: right !important;
  right: -25px !important;
  padding: 15px !important;
  text-align: left !important;
}

v-btn {
  color: #36bd90;
}

.main-action {
  margin-right: 10px !important;
  border-radius: 15px;
  padding: 15px 0px;
}

div#dashboard-container {
  background-color: #36bd90;
  color: black;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}

div#rightSideDashboard {
  display: flex;
  justify-content: left;
  align-items: center;
}

.nav-btn {
  background-color: transparent !important;
  color: black !important;
  font-weight: 900 !important;
  border: none !important;
  /* font-size: 12px; */
}

.db-logo {
  margin: 5px 25px;
}
</style>
