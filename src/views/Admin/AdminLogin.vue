<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h2 class="text-center text-dark mt-5">Đăng nhập quản trị viên</h2>

        <div class="card my-5">
          <form
            class="card-body cardbody-color p-lg-5"
            @submit.prevent="login()"
          >
            <div class="text-center">
              <img
                src="https://img.freepik.com/premium-vector/admin-clerk-with-laptop-icon_1076610-101107.jpg"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                width="200px"
                alt="profile"
              />
            </div>

            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                id="Username"
                aria-describedby="emailHelp"
                placeholder="Tên đăng nhập"
                v-model="user_name"
              />
            </div>
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Mật khẩu"
                v-model="password"
              />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-color px-5 mb-5 w-100">
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import authServices from "@/services/auth.services";
import Cookies from "js-cookie";
export default {
  name: "AdminLogin",
  data() {
    return {
      user_name: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const payload = {
          user_name: this.user_name,
          password: this.password,
        };
        const response = await authServices.loginAdmin(payload);
        console.log(response);
        if (response && response.success === true) {
          Cookies.set("access_token", response.accessToken, {
            expires: 1,
          });
          Cookies.set("refresh_token", response.refreshToken, {
            expires: 1,
          });
          const result = await Swal.fire({
            title: "Đăng nhập Admin thành công ",

            icon: "success",

            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            this.$router.push("/Admin");
          }
        } else {
          Swal.fire({
            icon: "error",
            title:
              "Sai tài khoản, mật khẩu hoặc bạn chưa có quyền truy cập vào trang quản trị",
            text: "Hãy đăng nhập lại",
          });
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Lỗi khi đăng nhập tài khoản",
            text: error.code,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
}
.btn-color {
  background-color: #0e1c36;
  color: #fff;
}

.profile-image-pic {
  height: 200px;
  width: 200px;
  object-fit: cover;
}

.cardbody-color {
  background-color: #ebf2fa;
}

a {
  text-decoration: none;
}
</style>
