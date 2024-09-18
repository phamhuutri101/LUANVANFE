<template>
  <!-- Section: Design Block -->
  <section class="background-radial-gradient overflow-hidden">
    <div class="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
      <div class="row gx-lg-5 align-items-center mb-5">
        <div class="col-lg-6 mb-5 mb-lg-0" style="z-index: 10">
          <h1
            class="my-5 display-5 fw-bold ls-tight"
            style="color: hsl(218, 81%, 95%)"
          >
            The best offer <br />
            <span style="color: hsl(218, 81%, 75%)">for your business</span>
          </h1>
          <p class="mb-4 opacity-70" style="color: hsl(218, 81%, 85%)">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Temporibus, expedita iusto veniam atque, magni tempora mollitia
            dolorum consequatur nulla, neque debitis eos reprehenderit quasi ab
            ipsum nisi dolorem modi. Quos?
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
                  <div class="col-md-4 mb-4">
                    <div data-mdb-input-init class="form-outline">
                      <input
                        v-model="fromData.first_name"
                        type="text"
                        id="form3Example1"
                        class="form-control"
                      />
                      <label class="form-label" for="form3Example1">Tên</label>
                    </div>
                  </div>
                  <div class="col-md-4 mb-4">
                    <div data-mdb-input-init class="form-outline">
                      <input
                        v-model="fromData.middle_name"
                        type="text"
                        id="form3Example1"
                        class="form-control"
                      />
                      <label class="form-label" for="form3Example1"
                        >Tên đệm</label
                      >
                    </div>
                  </div>
                  <div class="col-md-4 mb-4">
                    <div data-mdb-input-init class="form-outline">
                      <input
                        v-model="fromData.last_name"
                        type="text"
                        id="form3Example2"
                        class="form-control"
                      />
                      <label class="form-label" for="form3Example2">Họ</label>
                    </div>
                  </div>
                </div>

                <!-- Email input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
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
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.phone_number"
                  />
                  <label class="form-label" for="form3Example3"
                    >Số điện thoại</label
                  >
                </div>
                <!-- user name -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.user_name"
                  />
                  <label class="form-label" for="form3Example3"
                    >Tài khoản</label
                  >
                </div>
                <!-- Password input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <input
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
                <div class="text-center">
                  <p>Hoặc</p>
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-link btn-floating mx-1"
                  >
                    <i class="fab fa-facebook-f"></i>
                  </button>

                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-link btn-floating mx-1"
                  >
                    <i class="fab fa-google"></i>
                  </button>

                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-link btn-floating mx-1"
                  >
                    <i class="fab fa-twitter"></i>
                  </button>

                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-link btn-floating mx-1"
                  >
                    <i class="fab fa-github"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Section: Design Block -->
</template>

<script>
import Swal from "sweetalert2";
import authServices from "@/services/auth.services";
export default {
  name: "RegisterForm",
  data() {
    return {
      fromData: {
        first_name: "",
        last_name: "",
        middle_name: "",
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
  background-color: hsl(218, 41%, 15%);
  background-image: radial-gradient(
      650px circle at 0% 0%,
      hsl(218, 41%, 35%) 15%,
      hsl(218, 41%, 30%) 35%,
      hsl(218, 41%, 20%) 75%,
      hsl(218, 41%, 19%) 80%,
      transparent 100%
    ),
    radial-gradient(
      1250px circle at 100% 100%,
      hsl(218, 41%, 45%) 15%,
      hsl(218, 41%, 30%) 35%,
      hsl(218, 41%, 20%) 75%,
      hsl(218, 41%, 19%) 80%,
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
