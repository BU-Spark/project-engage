import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/AdminLogin",
    name: "adminLogin",
    component: () => import("@/views/AdminLogin.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/GoogleLogin",
    name: "googleLogin",
    component: () => import("@/views/GoogleLogin.vue"),
    meta: {
      requiresAuth: false
    }
  },
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
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/pending",
    name: "waitApproval",
    component: () => import("@/views/WaitApproval.vue"),
    meta: {
      requiresAuth: false
    }
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
