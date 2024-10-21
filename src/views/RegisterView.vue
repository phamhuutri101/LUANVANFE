<template>
  <Header />
  <!-- Section: Design Block -->
  <section class="background-radial-gradient overflow-hidden">
    <div class="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
      <div class="row gx-lg-5 align-items-center mb-5">
        <div class="col-lg-6 mb-5 mb-lg-0" style="z-index: 10">
          <h1
            class="my-5 display-5 fw-bold ls-tight"
            style="color: hsl(218, 81%, 95%)"
          >
            Đăng Ký Tài Khoản <br />
          </h1>
          <p class="mb-4 opacity-70" style="color: hsl(218, 81%, 85%)">
            Nền tảng thương mại điện tử
          </p>
        </div>

        <div class="col-lg-6 mb-5 mb-lg-0 position-relative">
          <div
            id="radius-shape-1"
            class="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            class="position-absolute shadow-5-strong"
          ></div>

          <div class="card bg-glass">
            <div class="card-body px-4 py-5 px-md-5">
              <form @submit.prevent="register">
                <!-- 2 column grid layout with text inputs for the first and last names -->
                <div class="row">
                  <div class="col-md-12 mb-4">
                    <div data-mdb-input-init class="form-outline">
                      <input
                        autocomplete="off"
                        v-model="fromData.full_name"
                        type="text"
                        id="form3Example2"
                        class="form-control"
                      />
                      <label class="form-label" for="form3Example2"
                        >Họ & Tên người dùng</label
                      >
                    </div>
                  </div>
                </div>
                <!-- user name -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
                    autocomplete="off"
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.user_name"
                  />
                  <label class="form-label" for="form3Example3"
                    >Tên đăng nhập</label
                  >
                </div>
                <!-- Email input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
                    autocomplete="off"
                    type="email"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.email_user"
                  />
                  <label class="form-label" for="form3Example3"
                    >Địa chỉ Email</label
                  >
                </div>
                <!-- phone number -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
                    autocomplete="off"
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.phone_number"
                  />
                  <label class="form-label" for="form3Example3"
                    >Số điện thoại</label
                  >
                </div>

                <!-- Password input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
                    autocomplete="off"
                    v-model="fromData.password"
                    type="password"
                    id="form3Example4"
                    class="form-control"
                  />
                  <label class="form-label" for="form3Example4 "
                    >Mật khẩu</label
                  >
                </div>

                <!-- Submit button -->
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  class="btn btn-primary btn-block mb-4 w-100"
                >
                  Đăng ký
                </button>

                <!-- Register buttons -->
              </form>
              <span class="d-flex justify-content-center">
                Bạn đã có tài khoản?
                <router-link class="px-1" to="/login">Đăng nhập</router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Section: Design Block -->
  <Footer />
</template>

<script>
import Swal from "sweetalert2";
import authServices from "@/services/auth.services";
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  components: { Header, Footer },

  name: "RegisterForm",
  data() {
    return {
      fromData: {
        full_name: "",
        email_user: "",
        phone_number: "",
        user_name: "",
        password: "",
      },
    };
  },
  methods: {
    async register() {
      try {
        await authServices.register(this.fromData);
        const sweetalert2 = Swal.fire({
          title: "Bạn đã đăng ký tài khoản thành công",
          text: "Vui lòng kiểm tra Email để kích hoạt tài khoản",
          icon: "success",
        });
        localStorage.setItem("registeredEmail", this.fromData.email_user);
        this.$router.push({ name: "ActiveAccount" });
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          Swal.fire({
            icon: "error",
            title: "Lỗi khi đăng ký tài khoản",
            text: error.response.data.message,
          });
        }
      }
    },
    validatePhoneNumber() {
      this.formData.phone_number = this.formData.phone_number.replace(
        /[^0-9]/g,
        ""
      );
    },
  },
};
</script>

<style scoped>
.background-radial-gradient {
  background-color: hsl(138, 54%, 42%);
  background-image: radial-gradient(
      650px circle at 0% 0%,
      hsl(125, 50%, 65%) 15%,
      hsl(125, 50%, 65%) 15%,
      transparent 100%
    ),
    radial-gradient(
      1250px circle at 100% 100%,
      hsl(125, 50%, 65%) 15%,
      hsl(125, 50%, 65%) 15%,
      hsl(125, 50%, 65%) 15%,
      hsl(16, 6%, 35%) 80%,
      transparent 100%
    );
}

#radius-shape-1 {
  height: 220px;
  width: 220px;
  top: -60px;
  left: -130px;
  background: radial-gradient(#44006b, #ad1fff);
  overflow: hidden;
}

#radius-shape-2 {
  border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
  bottom: -60px;
  right: -110px;
  width: 300px;
  height: 300px;
  background: radial-gradient(#44006b, #ad1fff);
  overflow: hidden;
}

.bg-glass {
  background-color: hsla(0, 0%, 100%, 0.9) !important;
  backdrop-filter: saturate(200%) blur(25px);
}
</style>
