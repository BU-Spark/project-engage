import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";
import "./assets/formulate.css";
import "./assets/print.css";
import VueFormulateCombobox from "@/plugins/VueFormulateCombobox";
Vue.component("VueFormulateCombobox", VueFormulateCombobox);
import VueFormulateComboboxSpecial from "@/plugins/VueFormulateComboboxSpecial";
Vue.component("VueFormulateComboboxSpecial", VueFormulateComboboxSpecial);
import VueFormulateTextarea from "@/plugins/VueFormulateTextarea";
Vue.component("VueFormulateTextarea", VueFormulateTextarea);
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth } from "@/firebase/init";

Vue.config.productionTip = false;
Vue.use(VueFormulate, {
  rules: {
    checkFileType: ({ value }) => {
      if (value.files) {
        var lstFiles = value.files;
        // check if resume file type is one of the following
        // .pdf, .doc, .docx, .jpeg, .jpg, .png
        for (var i = 0; i < lstFiles.length; i++) {
          if (lstFiles[i].file.type == false) {
            continue;
          } else if (
            lstFiles[i].file.type != "application/pdf" &&
            lstFiles[i].file.type != "application/msword" &&
            lstFiles[i].file.type !=
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
            lstFiles[i].file.type != "image/jpeg" &&
            lstFiles[i].file.type != "image/jpg" &&
            lstFiles[i].file.type != "image/png"
          ) {
            return false;
          }
        }
      }
      return true;
    }
  },
  library: {
    combobox: {
      classification: "combobox",
      component: "VueFormulateCombobox",
      slotProps: {
        component: ["items", "validation"]
      }
    },
    comboboxSpecial: {
      classification: "comboboxSpecial",
      component: "VueFormulateComboboxSpecial",
      slotProps: {
        component: ["items", "validation"]
      }
    },
    textarea: {
      classification: "textarea",
      component: "VueFormulateTextarea",
      slotProps: {
        component: ["rules"]
      }
    }
  }
});
var app = null;
auth.onAuthStateChanged(async () => {
  if (!app) {
    await store.dispatch("getUser");
    new Vue({
      router,
      store,
      vuetify,
      VueFormulate,
      render: h => h(App)
    }).$mount("#app");
  }
});
