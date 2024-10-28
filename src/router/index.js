import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ActiveAccountView from "@/views/ActiveAccountView.vue";
import DetailView from "@/views/DetailView.vue";
import CartView from "@/views/CartView.vue";
import test from "@/views/test.vue";
import testFoodDetail from "@/views/test-foodDetail.vue";
import AdminDashboardForECommerceSeller from "@/views/Admin Dashboard for E-commerce Seller.vue";
import getCookieValue from "../utils/getCookie";
import deleteCookie from "../utils/deleteCookie";
import isTokenValid from "../utils/isTokenValid";
import AddProduct from "@/components/admin/sales management/AddProduct.vue";
import CheckOutView from "@/views/CheckOutView.vue";
import SearchView from "@/views/SearchView.vue";
import ProductByCategoryView from "@/views/ProductByCategoryView.vue";
import CreateShopView from "@/views/CreateShopView.vue";
import AdminLogin from "@/views/Admin/AdminLogin.vue";
import DashBoard from "@/views/Admin/DashBoard.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/test-food",
    name: "test-food-detail",
    component: testFoodDetail,
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
    path: "/details/:id",
    name: "DetailView",
    component: DetailView,
  },
  {
    path: "/cart",
    name: "CartView",
    component: CartView,
  },
  {
    path: "/checkout",
    name: "checkoutView",
    component: CheckOutView,
  },
  {
    path: "/products/:id",
    name: "ProductCategoryView",
    component: ProductByCategoryView,
  },
  {
    path: "/create-shop",
    name: "CreateShopView",
    component: CreateShopView,
  },

  {
    path: "/test",
    name: "test",
    component: test,
  },
  {
    path: "/search",
    name: "SearchView",
    component: SearchView,
  },
  {
    path: "/user",
    name: "information",
    meta: {
      requiredAuth: true,
    },
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
  {
    path: "/admin/ProductManagement",
    name: "ProductManagement",
    component: AdminDashboardForECommerceSeller,
    meta: {
      requiredAuth: true,
    },
  },
  {
    path: "/admin/ProductManagement/addProduct",
    name: "AddProductForm",
    component: AddProduct,
  },
  {
    path: "/Admin/Login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/Admin",
    name: "Dashboard",
    component: DashBoard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = getCookieValue("access_token");

  if (to.path === "/login" && token && isTokenValid(token)) {
    return next("/");
  } else if (to.meta.requiredAuth) {
    if (token) {
      if (isTokenValid(token)) {
        next();
      } else {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        next("/login");
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
