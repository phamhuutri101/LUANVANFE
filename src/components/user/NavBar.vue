<template>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Logo</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <router-link to="/">
          <li class="nav-item active">
            <a class="nav-link" href="#">Trang chủ </a>
          </li>
        </router-link>
        <li class="nav-item">
          <router-link to="/seller"
            ><a class="nav-link" href="#">Trở thành người Bán</a></router-link
          >
        </li>

        <li class="nav-item">
          <a class="nav-link" href="#">Yêu thích</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-haspopup="true"
          >
            Tài khoản
          </a>
          <div
            class="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <router-link to="/login"
              ><a class="dropdown-item"> Đăng nhập </a></router-link
            >
            <a
              class="dropdown-item"
              data-bs-toggle="modal"
              data-bs-target="#register-modal"
              href="#"
            >
              Đăng kí
            </a>
            <router-link to="/user">
              <a class="dropdown-item" href="#">Thông tin cá nhân</a>
            </router-link>
            <a class="dropdown-item" href="#">Đăng xuất</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style></style>
