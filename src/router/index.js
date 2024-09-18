import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ActiveAccountView from "@/views/ActiveAccountView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LoginForm",
    component: LoginView,
  },
  {
    path: "/register",
    name: "RegisterForm",
    component: RegisterView,
  },
  {
    path: "/active",
    name: "ActiveAccount",
    component: ActiveAccountView,
  },
  {
    path: "/user",
    name: "infomation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Infomation.vue"),
  },
  {
    path: "/Seller",
    name: "seller",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Sell.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
