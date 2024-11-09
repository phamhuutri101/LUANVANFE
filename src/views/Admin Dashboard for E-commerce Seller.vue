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
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Quản lý kho
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    class="dropdown-item"
                    @click="currentView = 'AddInventory'"
                    href="#"
                    >Nhập kho</a
                  >
                </li>
                <li>
                  <a
                    @click="currentView = 'inventory'"
                    class="dropdown-item"
                    href="#"
                    >phiếu nhập kho</a
                  >
                </li>
              </ul>
            </li>

            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'voucherManager'"
              >
                <i class="fa-solid fa-money-bill-wave"></i> Quản lý mã giảm
                giá</a
              >
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'priceManager'"
              >
                <i class="fa-solid fa-money-bill-wave"></i> Quản lý giá
              </a>
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'orderManager'"
              >
                <i class="fa-solid fa-money-bill-wave"></i> Quản lý đơn hàng
              </a>
            </li>
            <li class="nav-item px-2">
              <a
                class="nav-link text-white"
                href="#"
                @click="currentView = 'RatingManager'"
              >
                <i class="fa-solid fa-star"></i> Danh sách đánh giá</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <component
        :is="currentView"
        @add-product-success="handleAddProductSuccess"
      ></component>
    </div>
  </div>
</template>

<script>
import ProductManagement from "../components/admin/sales management/ProductManagement.vue";
import RatingManager from "@/components/admin/sales management/RatingManager.vue";
import voucherManager from "@/components/admin/sales management/voucherManager.vue";
import AddProduct from "@/components/admin/sales management/AddProduct.vue";
import OverViewPage from "@/components/admin/sales management/OverViewPage.vue";
import inventory from "@/components/admin/sales management/inventory.vue";
import AddInventory from "@/components/admin/sales management/AddInventory.vue";
import priceManager from "@/components/admin/sales management/priceManager.vue";
import orderManager from "@/components/admin/sales management/orderManager.vue";
export default {
  name: "App",
  components: {
    ProductManagement,
    RatingManager,
    voucherManager,
    AddProduct,
    OverViewPage,
    inventory,
    AddInventory,
    priceManager,
    orderManager,
  },
  data() {
    return {
      currentView: "OverViewPage",
    };
  },
  methods: {
    handleAddProductSuccess() {
      // Khi nhận được sự kiện từ AddProduct, chuyển sang ProductManagement
      this.currentView = "ProductManagement";
    },
  },
};
</script>
<style scoped>
.navbar-shop {
  background: #ff5733;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem !important;
  border-radius: 4px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link i {
  margin-right: 6px;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 8px;
}

.dropdown-item {
  padding: 0.7rem 1.5rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #fff1ef;
  color: #ff5733;
}

.navbar-nav {
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.nav-item {
  margin: 0 5px;
}

@media (max-width: 992px) {
  .navbar-nav {
    padding: 1rem 0;
  }

  .nav-item {
    margin: 5px 0;
  }
}
</style>
