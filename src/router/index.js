import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/home",
    name: "home",
    props: true,
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/studentApplications", // admin navbar "application"
    name: "studentApplications",
    component: () => import("@/components/Admin/StudentApplications.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/studentApp", // admin
    name: "studentApp",
    component: () => import("@/components/Admin/StudentApplication.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/studentAppExport", // admin
    name: "studentAppExport",
    component: () => import("@/components/Admin/StudentApplicationExport.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/studentProfile", // admin
    name: "studentProfile",
    component: () => import("@/components/Admin/ViewStudentProfile.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/studentProfileExport", // admin
    name: "studentProfileExport",
    component: () => import("@/components/Admin/StudentProfileExport.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/applicationForms", // admin navbar "programs"
    name: "applicationForms",
    component: () => import("@/components/Admin/ApplicationForms.vue"),
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/applicationForm", // admin
    name: "applicationForm",
    component: () => import("@/components/Admin/ApplicationForm.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    },
    props: {
      header: true,
      content: true
    }
  },
  {
    path: "/profile", // admin navbar "USER_NAME", student navbar "USER_NAME"
    name: "profile",
    component: () => import("@/components/General/Profile.vue"),
    props: {
      header: true,
      content: true
    }
  },

  // PLEASE MAKE SURE THAT THIS IS ALWAYS THE LAST ROUTE!!!
  {
    path: "*",
    name: "notFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

//navagation protection - needs to authenicated before proceeding or else direct to login page
router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let user = store.state.user;
    if (user) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

//navagation protection - needs to be an admin before proceeding or else direct to login page
router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.isAdmin)) {
    let isAdmin = store.state.isAdmin;
    if (isAdmin) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
