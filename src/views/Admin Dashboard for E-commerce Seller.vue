<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Admin Dashboard</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                @click="currentView = 'ProductManagement'"
                >Quản lý sản phẩm</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                @click="currentView = 'CategoryManagement'"
                >Quản lý danh mục</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                @click="currentView = 'PriceManagement'"
                >Quản lý giá</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script>
import ProductManagement from "../components/admin/sales management/ProductManagement.vue";
import CategoryManagement from "../components/admin/sales management/CategoryManagement.vue";
import PriceManagement from "../components/admin/sales management/PriceManagement.vue";

export default {
  name: "App",
  components: {
    ProductManagement,
    CategoryManagement,
    PriceManagement,
  },
  data() {
    return {
      currentView: "ProductManagement",
    };
  },
};
</script>
