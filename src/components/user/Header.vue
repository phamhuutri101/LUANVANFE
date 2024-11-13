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
      <!-- Nút micro để kích hoạt tìm kiếm bằng giọng nói -->
      <button class="btn btn-secondary ms-2" @click="startVoiceSearch">
        <i class="fa-solid fa-microphone"></i>
      </button>
    </div>

    <!-- Navigation Items Section -->
    <div class="d-flex align-items-center">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/create-shop" class="text-decoration-none">
            <a class="nav-link text-light" href="#">
              <i class="fa-solid fa-shop"></i>
              <span> Kênh người Bán </span>
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
          {{ cartItemCount }}
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
      recognition: null,
    };
  },

  created() {},

  mounted() {
    this.$store.dispatch("fetchCart"); // Gọi action để lấy dữ liệu giỏ hàng
  },
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
    onSearch() {
      if (this.searchTerm.trim()) {
        this.$router.push({
          name: "SearchView",
          query: { search: this.searchTerm.trim() },
        });
      }
    },
    startVoiceSearch() {
      if (this.recognition) {
        this.recognition.start(); // Bắt đầu nhận dạng giọng nói
      } else {
        alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói");
      }
    },
  },
  computed: {
    isLoggedIn() {
      return !!getCookie("access_token");
    },
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    },
  },
  mounted() {
    // Kiểm tra nếu trình duyệt hỗ trợ Web Speech API
    if ("webkitSpeechRecognition" in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = "vi-VN"; // Thiết lập ngôn ngữ là tiếng Việt
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      // Sự kiện khi nhận dạng hoàn thành
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.searchTerm = transcript; // Cập nhật kết quả vào thanh tìm kiếm
        this.onSearch(); // Tự động tìm kiếm sau khi nhận dạng xong
      };

      // Sự kiện khi gặp lỗi
      this.recognition.onerror = (event) => {
        console.error("Lỗi nhận dạng giọng nói:", event);
      };
    } else {
      console.warn("Trình duyệt không hỗ trợ Web Speech API");
    }
  },
};
</script>

<style scoped>
.navbar-main {
  background: linear-gradient(to right, #09884d, #0eba69);
  padding: 10px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Logo styling */
.navbar-main span {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Search bar styling */
.input-custom {
  width: 500px;
  height: 38px;
  border-radius: 20px;
  padding: 0 40px 0 15px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

.input-custom:focus {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  background: #ffffff;
  outline: none;
}

.button-custom {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #09884d;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.button-custom:hover {
  color: #076d3d;
  transform: translateY(-50%) scale(1.1);
}

/* Voice search button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.btn-secondary i {
  color: #ffffff;
  font-size: 14px;
}

/* Navigation items */
.nav-item {
  margin: 0 8px;
}

.nav-link {
  color: #ffffff !important;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link i {
  font-size: 14px;
}

/* Dropdown styling */
.dropdown-menu {
  background: #ffffff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  padding: 8px 0;
  min-width: 180px;
}

.dropdown-item {
  color: #2c3e50;
  padding: 8px 16px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #09884d;
  transform: translateX(5px);
}

/* Cart styling */
.cart {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.cart span {
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
}

.cart i {
  color: #ffffff;
  font-size: 14px;
}

/* Badge styling */
.badge {
  padding: 4px 6px;
  font-size: 11px;
  font-weight: 500;
  background: #ff4757 !important;
  border: 2px solid #ffffff;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu.show {
  animation: slideDown 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .input-custom {
    width: 280px;
  }

  .nav-item {
    margin: 4px 0;
  }

  .cart {
    margin-top: 8px;
  }

  .button-custom {
    right: 45px;
  }
}

/* Form position relative for search */
form {
  position: relative;
  display: flex;
  align-items: center;
}

.button-custom i {
  font-size: 14px;
}

/* Focus states for accessibility */
.input-custom:focus-visible,
.nav-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}
</style>
