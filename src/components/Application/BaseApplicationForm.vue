<template>
  <v-container>
    <DeleteItem
      v-if="this.deleteItem && !this.addItem"
      :schema="schema"
      @deleteItem="changeDeleteItemState()"
      @itemDeleted="deleteField"
    />
    <v-btn
      v-if="!this.deleteItem && !this.addItem"
      @click="changeDeleteItemState()"
      >Delete Item</v-btn
    >

    <AddItem
      v-if="this.addItem && !this.deleteItem"
      :schema="schema"
      @addItem="changeAddItemState()"
      @itemAdded="addField"
    />
    <v-btn
      v-if="!this.addItem && !this.deleteItem"
      @click="changeAddItemState()"
      >Add Item</v-btn
    >

    <FormulateForm class="form-wrapper" v-model="values" :schema="schema" />
    <v-btn @click="submitFormTemplate"> Submit Form Template</v-btn>
  </v-container>
</template>

<script>
import { functions, db } from "@/firebase/init";
import "@/assets/formulate.css";
import AddItem from "@/plugins/AddItem.vue";
import DeleteItem from "@/plugins/DeleteItem.vue";

export default {
  name: "BaseApplicationForm",
  components: {
    AddItem,
    DeleteItem
  },
  data() {
    return {
      addItem: false,
      deleteItem: false,
      value: {},
      schema: [],
      search: null,
      firstName: null,
      lastName: null,
      email: null,
      buID: null,
      gender: null,
      // countryCode: "United States +1",
      phone: null,
      major: null,
      minor: null,
      schoolYear: null,
      graduation: null,
      clubSearch: null,
      clubs: [],
      githubURL: null,
      linkedinURL: null,
      otherURL: null,
      programmingLanguageSearch: null,
      programmingLanguageSkills: [],
      designSearch: null,
      designSkills: [],
      emailRules: [
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Please enter a valid email"
      ],
      urlRules: [
        v =>
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
            v
          ) || "Please enter a valid URL"
      ],
      requiredRule: [v => !!v || "Input is required."],
      valid: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    addField(value) {
      this.schema = value;
    },
    deleteField(value) {
      this.schema = value;
    },
    changeAddItemState() {
      this.addItem = !this.addItem;
      this.deleteItem = false;
    },
    changeDeleteItemState() {
      this.deleteItem = !this.deleteItem;
      this.addItem = false;
    },
    fileUpload(value) {
      if (value == "viewFile") {
        window.open(this.resume[0], "_blank");
      } else if (value == "deleteFile") {
        this.deleteResume();
      } else {
        this.uploadResume(value);
      }
    },
    async submitFormTemplate() {
      // const currentYear = new Date().getFullYear();
      const template = db.collection("applicationTemplate").doc("Base");
      template
        .update({
          [`template.schema`]: this.schema,
          [`template.deadline`]: ""
        })
        .then(() => {
          console.log("submitted");
        })
        .catch(error => {
          console.log(error);
        });
    },
    async uploadResume(value) {
      this.resumeLoading = true;
      this.uploadedResume = value;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedResume[0]);
      reader.onload = async () => {
        functions
          .httpsCallable("uploadResume")({
            file: reader.result.split(",")[1],
            displayName: this.user.displayName,
            type: this.uploadedResume[0].type,
            uid: this.user.uid
          })
          .then(async data => {
            this.resume = [data.data.URL, data.data.location];
            await db
              .collection("applications")
              .doc(this.user.uid)
              .update({
                resume: this.resume
              });
            this.uploadedResume = null;
            this.resumeLoading = false;
          });
      };
    },
    async deleteResume() {
      this.resumeLoading = true;
      await functions.httpsCallable("deleteResume")({
        uid: this.user.uid,
        location: this.resume[1]
      });
      this.resume = null;
      this.resumeLoading = false;
    },
    async check() {
      if (
        this.firstName == null ||
        this.lastName == null ||
        this.buID == null ||
        this.gender == null ||
        // this.countryCode == null ||
        this.phone == null ||
        this.major == null ||
        this.schoolYear == null ||
        this.graduation == null ||
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        ) ||
        !(this.essayAns.split(" ").length <= 200)
      ) {
        this.valid = false;
        return;
      }
      this.valid = true;
    }
  },
  async mounted() {
    const currentYear = new Date().getFullYear();
    const template = db.collection("applicationTemplate").doc("Base");
    template
      .get()
      .then(doc => {
        if (doc.exists) {
          const newestForm = doc.data().FormSchemas[currentYear];
          if (newestForm) {
            this.schema = newestForm;
          } else {
            const lastYear = (parseInt(currentYear) - 1).toString();
            this.schema = doc.data().FormSchemas[lastYear];
          }
        } else {
          template.set({
            [`FormSchemas.${currentYear}`]: {}
          });
        }
      })
      .catch(error => {
        console.log("Error getting document:", error);
      });
  },
  watch: {
    programmingLanguageSkills(val) {
      if (val && val.length > 10) {
        this.$nextTick(() => this.programmingLanguageSkills.pop());
      }
    },
    designSkills(val) {
      if (val && val.length > 10) {
        this.$nextTick(() => this.designSkills.pop());
      }
    },
    clubs(val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.clubs.pop());
      }
    }
  }
};
</script>

<!-- <style scoped>
    /* .formulate-input-element .formulate-input-element--group .formulate-input-group {
        width: 100%;
    }
    
    .formulate-input-group-repeatable {
        width: 100%;
    } */
    
    .form-wrapper {
        padding: 2em;
        border: 1px solid #a8a8a8;
        border-radius: .5em;
        box-sizing: border-box;
    }
    
    .double-row {
        width: 700px;
        color: aqua;
    }
    /* @media (min-width: 650px) {
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
    */
    
    .formulate-input {
        margin-right: 2em;
        margin-bottom: 0;
        color: aqua;
    }
</style> -->
