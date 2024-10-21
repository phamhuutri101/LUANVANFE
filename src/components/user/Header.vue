<template>
  <!-- Navbar -->
  <nav
    class="sticky-top navbar navbar-expand-lg navbar-main d-flex justify-content-around"
  >
    <!-- Search Bar Section -->
    <router-link to="/" class="text-decoration-none">
      <div class="d-flex align-items-center">
        <span>LOGO</span>
      </div>
    </router-link>

    <div class="d-flex align-items-center position-relative">
      <form class="d-flex" role="search" @submit.prevent="onSearch">
        <input
          v-model="searchTerm"
          class="form-control input-custom"
          type="search"
          placeholder="Tìm kiếm sản phẩm"
          aria-label="Search"
        />
        <button class="btn button-custom" type="submit">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>

    <!-- Navigation Items Section -->
    <div class="d-flex align-items-center">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link
            to="/admin/ProductManagement"
            class="text-decoration-none"
          >
            <a class="nav-link text-light" href="#">
              <i class="fa-solid fa-shop"></i>
              <span> Trở thành người Bán </span>
            </a>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/user"
            class="nav-link text-light"
            @click.prevent="onFavoriteClick"
          >
            <i class="fa-solid fa-heart"></i>
            <span> Yêu thích </span>
          </router-link>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-light"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <i class="fa-solid fa-user"></i>
            <span>Tài khoản</span>
          </a>
          <div
            class="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <router-link to="/user" v-if="getCookie()">
              <a class="dropdown-item" href="#">Tài khoản của tôi</a>
            </router-link>

            <a class="dropdown-item" v-if="accessToken" @click="deleteCookie"
              >Đăng xuất</a
            >
            <router-link to="/login" v-else>
              <a class="dropdown-item">Đăng nhập</a>
              <router-link to="/register">
                <a class="dropdown-item">Đăng ký</a>
              </router-link>
            </router-link>
          </div>
        </li>
      </ul>
    </div>
    <router-link to="/cart" class="text-decoration-none">
      <div class="cart position-relative">
        <span
          class="position-absolute top-200 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {{ count }}
          <!-- Replace this with your dynamic count -->
        </span>
        <i class="fa-solid fa-cart-shopping"></i>

        <span>Giỏ hàng</span>
      </div>
    </router-link>
  </nav>
</template>

<script>
import getCookie from "@/utils/getCookie";
import deleteCookie from "@/utils/deleteCookie";

export default {
  data() {
    return {
      accessToken: getCookie("access_token"),
      searchTerm: "",
      count: 0,
    };
  },
  created() {},
  watch: {
    accessToken() {
      // Khi cookie thay đổi, cập nhật lại trạng thái giao diện
      if (!this.accessToken) {
        this.$forceUpdate(); // Cập nhật lại giao diện
      }
    },
  },
  methods: {
    getCookie() {
      const cookie = getCookie("access_token");
      return cookie;
    },
    deleteCookie() {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      this.$router.push("/login");
      this.accessToken = null;
    },
    onSearch() {
      if (this.searchTerm.trim()) {
        this.$router.push({
          name: "SearchView",
          query: { search: this.searchTerm.trim() },
        });
      }
    },
    onFavoriteClick() {
      this.$router.push({
        name: "information",
        query: { component: "favorite" },
      });
    },
  },
  computed: {
    isLoggedIn() {
      return !!getCookie("access_token");
    },
  },
};
</script>

<style scoped>
.navbar-main {
  background: #0eba69;
}
.button-custom {
  position: absolute;
}
.input-custom {
  width: 500px;
  height: 40px;
  border-radius: 10px;
}
.cart {
  border: 1px solid #82d9b1;
  padding: 10px;
  border-radius: 30px;
}
.cart span {
  color: #fff;
}
.cart i {
  color: #fff;
  margin-right: 20px;
}
</style>
