<template>
  <Header />
  <div class="activation-container pt-5 my-5">
    <h3 class="text-center">Kích hoạt tài khoản</h3>
    <Form @submit="submitActivationCode" :validation-schema="schema">
      <div>
        <ErrorMessage name="activationCode" class="text-danger" />
        <Field
          name="activationCode"
          type="text"
          maxlength="6"
          class="form-control text-center"
          v-model="activationCode"
          placeholder="Nhập mã kích hoạt"
          @keydown.enter="submitActivationCode"
        />
        <div class="text-center">
          <button type="submit" class="btn btn-primary mt-3">
            Kích hoạt Tài khoản
          </button>
        </div>
      </div>
    </Form>

    <p class="mt-3 text-center">
      Thời gian còn lại: {{ minutes }}:{{ seconds < 10 ? "0" : ""
      }}{{ seconds }}
    </p>
    <p @click="reActive" class="re-active mt-3 text-center text-info">
      Gửi lại mã kích hoạt
    </p>
  </div>
  <Footer />
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import authServices from "@/services/auth.services";
import emailServices from "@/services/email.services";
import Swal from "sweetalert2";
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  components: {
    Header,
    Footer,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      activationCode: yup
        .string()
        .required("Vui lòng nhập mã kích hoạt")
        .length(6, "Mã kích hoạt phải có 6 ký tự")
        .matches(/^[0-9]+$/, "Mã kích hoạt chỉ được chứa số"),
    });
    return {
      activationCode: "",
      timeLeft: 300, // 5 minutes in seconds
      schema,
    };
  },
  computed: {
    minutes() {
      return Math.floor(this.timeLeft / 60);
    },
    seconds() {
      return this.timeLeft % 60;
    },
  },
  methods: {
    countdown() {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    },
    async submitActivationCode(values) {
      if (this.activationCode.length === 6) {
        try {
          const response = await authServices.activeOtp(
            localStorage.getItem("registeredEmail"),
            values
          );
          Swal.fire({
            title: "Kích hoạt tài khoản thành công",
            icon: "success",
          });
          localStorage.removeItem("registeredEmail");
          this.$router.push("/login");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Sai mã kích hoạt.",
            footer: '<a href="#">Gửi lại mã kích hoạt?</a>',
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "vui lòng nhập đủ 6 số",
        });
      }
    },
    // reActive test chưa thành công
    async reActive() {
      try {
        const response = await emailServices.sendMailOTP(
          localStorage.getItem("registeredEmail")
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.timer = setInterval(this.countdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.activation-container {
  max-width: 400px;
  margin: 0 auto;
  height: 70vh;
  padding: 30px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  animation: slideUp 0.5s ease;
}

h3 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
}

h3::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #09884d, #0eba69);
  border-radius: 2px;
}

input.form-control {
  font-size: 28px;
  height: 60px;
  text-align: center;
  letter-spacing: 12px;
  font-weight: 600;
  color: #2c3e50;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  padding: 10px 15px;
  margin-top: 20px;
}

input.form-control:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 4px rgba(9, 136, 77, 0.1);
  background: #ffffff;
  outline: none;
}

input.form-control::placeholder {
  letter-spacing: normal;
  font-size: 16px;
  color: #95a5a6;
  font-weight: normal;
}

.btn-primary {
  background: linear-gradient(45deg, #09884d, #0eba69);
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(9, 136, 77, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(9, 136, 77, 0.3);
  background: linear-gradient(45deg, #076d3d, #09884d);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Timer styling */
p {
  color: #666;
  font-size: 16px;
  margin: 15px 0;
}

.re-active {
  color: #09884d !important;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 5px 0;
}

.re-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #09884d;
  transition: all 0.3s ease;
}

.re-active:hover::after {
  width: 100%;
}

.re-active:hover {
  color: #076d3d !important;
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
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Timer animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

p:nth-of-type(1) {
  font-size: 18px;
  font-weight: 600;
  color: #09884d;
  animation: pulse 2s infinite;
}

/* Input focus ring animation */
@keyframes focusRing {
  0% {
    box-shadow: 0 0 0 0 rgba(9, 136, 77, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(9, 136, 77, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(9, 136, 77, 0);
  }
}

input.form-control:focus {
  animation: focusRing 0.8s ease-out;
}

/* Error state */
input.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

/* Success state */
.success-checkmark {
  color: #09884d;
  font-size: 24px;
  animation: checkmark 0.3s ease-in-out forwards;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive design */
@media (max-width: 480px) {
  .activation-container {
    padding: 20px;
    margin: 10px;
    height: auto;
    min-height: 60vh;
  }

  h3 {
    font-size: 24px;
  }

  input.form-control {
    font-size: 24px;
    height: 50px;
    letter-spacing: 8px;
  }

  .btn-primary {
    padding: 10px 30px;
    font-size: 14px;
  }
}
</style>
