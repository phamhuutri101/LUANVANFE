<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-shop">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'OverViewPage'"
              >
                <i class="fa-solid fa-compass"></i> Tổng quan</a
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Quản lý Sản phẩm
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    class="dropdown-item"
                    @click="currentView = 'AddProduct'"
                    href="#"
                    >Thêm sản phẩm</a
                  >
                </li>
                <li>
                  <a
                    @click="currentView = 'ProductManagement'"
                    class="dropdown-item"
                    href="#"
                    >Tất cả sản phẩm trong shop</a
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'CategoryManagement'"
              >
                <i class="fa-solid fa-list"></i> Quản lý danh mục</a
              >
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'inventory'"
              >
                <i class="fa-solid fa-boxes-stacked"></i> Nhập kho</a
              >
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'PriceManagement'"
              >
                <i class="fa-solid fa-money-bill-wave"></i> Quản lý giá</a
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
import AddProduct from "@/components/admin/sales management/AddProduct.vue";
import OverViewPage from "@/components/admin/sales management/OverViewPage.vue";
import inventory from "@/components/admin/sales management/inventory.vue";
export default {
  name: "App",
  components: {
    ProductManagement,
    CategoryManagement,
    PriceManagement,
    AddProduct,
    OverViewPage,
    inventory,
  },
  data() {
    return {
      currentView: "OverViewPage",
    };
  },
};
</script>
<style scoped>
.navbar-shop {
  background: #ff5733;
}
</style>
