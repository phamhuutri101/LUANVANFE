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
              <Form @submit="register" :validation-schema="schema">
                <!-- 2 column grid layout with text inputs for the first and last names -->
                <div class="row">
                  <div class="col-md-12 mb-4">
                    <div data-mdb-input-init class="form-outline">
                      <label class="form-label" for="form3Example2"
                        >Họ & Tên người dùng</label
                      >
                      <Field
                        name="full_name"
                        autocomplete="off"
                        v-model="fromData.full_name"
                        type="text"
                        id="form3Example2"
                        class="form-control"
                      />

                      <ErrorMessage name="full_name" class="text-danger" />
                    </div>
                  </div>
                </div>
                <!-- user name -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <label class="form-label" for="form3Example3"
                    >Tên đăng nhập</label
                  >
                  <Field
                    autocomplete="off"
                    name="user_name"
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.user_name"
                  />
                  <ErrorMessage name="user_name" class="text-danger" />
                </div>
                <!-- Email input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <label class="form-label" for="form3Example3"
                    >Địa chỉ Email</label
                  >
                  <Field
                    name="email_user"
                    autocomplete="off"
                    type="email"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.email_user"
                  />
                  <ErrorMessage name="email_user" class="text-danger" />
                </div>
                <!-- phone number -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <label class="form-label" for="form3Example3"
                    >Số điện thoại</label
                  >
                  <Field
                    name="phone_number"
                    autocomplete="off"
                    type="text"
                    id="form3Example3"
                    class="form-control"
                    v-model="fromData.phone_number"
                  />
                  <ErrorMessage name="phone_number" class="text-danger" />
                </div>

                <!-- Password input -->
                <div data-mdb-input-init class="form-outline mb-4">
                  <label class="form-label" for="form3Example4 "
                    >Mật khẩu</label
                  >
                  <div class="relative">
                    <Field
                      name="password"
                      autocomplete="off"
                      v-model="fromData.password"
                      :type="showPassword ? 'text' : 'password'"
                      id="form3Example4"
                      class="form-control"
                    />
                    <button type="button" @click="togglePassword">
                      <i
                        :class="
                          showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="text-danger" />
                </div>
                <div data-mdb-input-init class="form-outline mb-4">
                  <label class="form-label" for="form3Example4 "
                    >Nhập lại mật khẩu</label
                  >
                  <div class="relative">
                    <Field
                      name="re_password"
                      autocomplete="off"
                      v-model="re_password"
                      :type="showRePassword ? 'text' : 'password'"
                      id="form3Example4"
                      class="form-control"
                    />
                    <button type="button" @click="toggleRePassword">
                      <i
                        :class="
                          showRePassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <ErrorMessage name="re_password" class="text-danger" />
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
              </Form>
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import authServices from "@/services/auth.services";
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";

export default {
  components: { Header, Footer, Form, Field, ErrorMessage },

  name: "RegisterForm",
  data() {
    const schema = yup.object().shape({
      full_name: yup
        .string()
        .required("Họ tên không được để trống")
        .min(2, "Họ tên phải có ít nhất 2 ký tự")
        .max(50, "Họ tên không được vượt quá 50 ký tự"),
      user_name: yup
        .string()
        .required("Tên đăng nhập không được để trống")
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
        .matches(
          /^[a-zA-Z0-9_]+$/,
          "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
        ),
      email_user: yup
        .string()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),
      phone_number: yup
        .string()
        .required("Số điện thoại không được để trống")
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
      password: yup
        .string()
        .required("Mật khẩu không được để trống")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
        ),
      re_password: yup
        .string()
        .required("Xác nhận mật khẩu mới không được để trống")
        .oneOf(
          [yup.ref("password"), null],
          "Mật khẩu xác nhận phải trùng với mật khẩu mới"
        ),
    });
    return {
      fromData: {
        full_name: "",
        email_user: "",
        phone_number: "",
        user_name: "",
        password: "",
      },
      re_password: "",
      showPassword: false,
      showRePassword: false,
      schema,
    };
  },
  methods: {
    async register(values) {
      try {
        await authServices.register(values);
        const sweetalert2 = Swal.fire({
          title: "Bạn đã đăng ký tài khoản thành công",
          text: "Vui lòng kiểm tra Email để kích hoạt tài khoản",
          icon: "success",
        });
        localStorage.setItem("registeredEmail", values.email_user);
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
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleRePassword() {
      this.showRePassword = !this.showRePassword;
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
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Left content styling */
.display-5 {
  font-size: 3.5rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 2rem;
  animation: fadeInLeft 1s ease;
}

.opacity-70 {
  font-size: 1.1rem;
  line-height: 1.8;
  animation: fadeInLeft 1s ease 0.3s;
  animation-fill-mode: both;
}

/* Decorative shapes */
#radius-shape-1 {
  height: 220px;
  width: 220px;
  top: -60px;
  left: -130px;
  background: linear-gradient(45deg, #09884d, #0eba69);
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 0 50px rgba(9, 136, 77, 0.3);
}

#radius-shape-2 {
  border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
  bottom: -60px;
  right: -110px;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #09884d, #0eba69);
  animation: float 8s ease-in-out infinite;
  animation-delay: -3s;
  box-shadow: 0 0 50px rgba(9, 136, 77, 0.3);
}

/* Card styling */
.card.bg-glass {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease;
}

.card.bg-glass:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Form controls */
.form-control {
  height: 50px;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 4px rgba(9, 136, 77, 0.1);
  outline: none;
}

.form-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

/* Login button */
.btn-primary {
  background: linear-gradient(45deg, #09884d, #0eba69);
  border: none;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(9, 136, 77, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(9, 136, 77, 0.3);
  background: linear-gradient(45deg, #076d3d, #09884d);
}

/* Social buttons */
.btn-floating {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-floating:hover {
  transform: translateY(-3px);
  background: #09884d;
  color: white !important;
}

.fab {
  transition: all 0.3s ease;
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Separator "Hoặc" styling */
p {
  color: #666;
  font-size: 14px;
  margin: 20px 0;
  position: relative;
}

p::before,
p::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

p::before {
  left: 0;
}

p::after {
  right: 0;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .display-5 {
    font-size: 2.5rem;
  }

  .card.bg-glass {
    margin-top: 2rem;
  }

  #radius-shape-1,
  #radius-shape-2 {
    display: none;
  }
}

/* Loading state */
.btn-primary.loading {
  position: relative;
  color: transparent;
}

.btn-primary.loading::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Error state */
.form-control.is-invalid {
  border-color: #ff4757;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23ff4757'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ff4757' stroke='none'/%3e%3c/svg%3e");
  padding-right: 40px;
}

.invalid-feedback {
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
}
/* css mắt password */
/* Thêm vào phần <style scoped> */

/* Position for password input container */
.form-outline .relative {
  position: relative;
  display: flex;
  align-items: center;
}

/* Style for the eye button */
.form-outline .relative button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

/* Adjust padding for password input */
.form-outline .relative .form-control {
  padding-right: 45px; /* Make space for the eye icon */
}

/* Style for the icon */
.form-outline .relative button i {
  font-size: 18px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.form-outline .relative button:hover i {
  color: #374151;
}

/* Remove button outline */
.form-outline .relative button:focus {
  outline: none;
}
</style>
