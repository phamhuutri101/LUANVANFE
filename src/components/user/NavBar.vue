<template>
  <!-- Navbar -->
  <nav
    class="sticky-top navbar navbar-expand-lg navbar-main d-flex justify-content-around"
  >
    <!-- Search Bar Section -->
    <div class="d-flex align-items-center">
      <span>LOGO</span>
    </div>
    <div class="d-flex align-items-center position-relative">
      <form class="d-flex" role="search">
        <input
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
          <router-link to="/seller" class="text-decoration-none">
            <a class="nav-link text-light" href="#">
              <i class="fa-solid fa-shop"></i>
              <span> Trở thành người Bán </span>
            </a>
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="#">
            <i class="fa-solid fa-heart"></i>
            <span> Yêu thích </span>
          </a>
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
            <router-link to="/login">
              <a class="dropdown-item">Đăng nhập</a>
            </router-link>
            <a
              class="dropdown-item"
              data-bs-toggle="modal"
              data-bs-target="#register-modal"
              href="#"
              >Đăng kí</a
            >
            <router-link to="/user">
              <a class="dropdown-item" href="#">Thông tin cá nhân</a>
            </router-link>
            <a class="dropdown-item" href="#">Đăng xuất</a>
          </div>
        </li>
      </ul>
    </div>
    <div class="cart position-relative">
      <span
        class="position-absolute top-200 start-100 translate-middle badge rounded-pill bg-danger"
      >
        5
        <!-- Replace this with your dynamic count -->
      </span>
      <i class="fa-solid fa-cart-shopping"></i>

      <span>Giỏ hàng</span>
    </div>
  </nav>
</template>

<script>
export default {};
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
