import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

import { store } from "./store/store";
const app = createApp(App);
app.use(router);
app.use(store);

app.mount("#app");
