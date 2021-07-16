import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";
import "./assets/formulate.css";
import VueFormulateCombobox from "@/plugins/VueFormulateCombobox";
Vue.component("VueFormulateCombobox", VueFormulateCombobox);
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth } from "@/firebase/init";

Vue.config.productionTip = false;
Vue.use(VueFormulate, {
  library: {
    combobox: {
      classification: "combobox",
      component: "VueFormulateCombobox",
      slotProps: {
        component: ["items", "validation"]
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
