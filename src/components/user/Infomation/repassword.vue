<template>
  <div class="col-md-9 background-component background-height p-4">
    <div class="header border-bottom py-4">
      <div class="title d-block">
        <p>Đổi mật khẩu</p>
        <p>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>
    </div>
    <div class="body py-4">
      <Form @submit="changePassword" :validation-schema="schema">
        <div class="form-group">
          <label for="currentPassword">Mật khẩu hiện tại:</label>
          <Field
            name="currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            class="form-control"
            id="currentPassword"
            v-model="currentPassword"
            required
          />
          <button type="button" @click="toggleCurrentPassword">
            <i
              :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            ></i>
          </button>
          <ErrorMessage name="currentPassword" class="text-danger" />
        </div>
        <div class="form-group">
          <label for="newPassword">Mật khẩu mới:</label>
          <Field
            name="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="form-control"
            id="newPassword"
            v-model="newPassword"
            required
          />
          <button type="button" @click="toggleNewPassword">
            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <ErrorMessage name="newPassword" class="text-danger" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
          <Field
            name="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
          <button type="button" @click="toggleConfirmPassword">
            <i
              :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            ></i>
          </button>
          <ErrorMessage name="confirmPassword" class="text-danger" />
        </div>
        <button type="submit" class="btn btn-primary">xác nhận</button>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import authServices from "@/services/auth.services";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      currentPassword: yup
        .string()
        .required("Mật khẩu hiện tại không được để trống"),
      newPassword: yup
        .string()
        .required("Mật khẩu mới không được để trống")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
        .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
        .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
        ),
      confirmPassword: yup
        .string()
        .required("Xác nhận mật khẩu mới không được để trống")
        .oneOf(
          [yup.ref("newPassword"), null],
          "Mật khẩu xác nhận phải trùng với mật khẩu mới"
        ),
    });
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      schema,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async changePassword(values) {
      try {
        if (this.newPassword == this.confirmPassword) {
          const payload = {
            old_password: values.currentPassword,
            new_password: values.newPassword,
          };
          const changePassword = await authServices.changePassword(payload);
          console.log(changePassword);
          if (changePassword.data.success) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "đổi mật khẩu thành công!",
            });
            this.currentPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗii",
            text: "bạn cần hãy kiểm tra lại mật khẩu mới của mình!",
          });
          return;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "đổi mật khẩu thất bại!",
        });
        console.error(error);
      }
    },
    toggleCurrentPassword() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
};
</script>

<style scoped>
.background-component {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.background-height {
  min-height: 700px;
}

/* Header Section */
.header {
  padding: 25px 0;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 30px;
}

.title p:nth-child(1) {
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  position: relative;
  padding-left: 15px;
}

.title p:nth-child(1)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #09884d;
  border-radius: 2px;
}

.title p:nth-child(2) {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 10px;
  padding-left: 15px;
}

/* Form Container */
.body {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #ffffff;
}

.form-control:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 3px rgba(9, 136, 77, 0.1);
  outline: none;
}

.form-control:hover {
  border-color: #09884d;
}

/* Password Input Specific */
input[type="password"] {
  letter-spacing: 2px;
  font-family: monospace;
  padding-right: 40px;
}

/* Submit Button */
.btn-primary {
  background: #09884d;
  border: none;
  padding: 12px 30px;
  font-size: 15px;
  font-weight: 500;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 2px 6px rgba(9, 136, 77, 0.2);
}

.btn-primary:hover {
  background: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Password Strength Indicator (Optional) */
.password-strength {
  height: 4px;
  border-radius: 2px;
  margin-top: 5px;
  transition: all 0.3s ease;
  background: #f0f2f5;
}

.password-strength.weak {
  background: #ff4757;
  width: 33%;
}
.password-strength.medium {
  background: #ffa502;
  width: 66%;
}
.password-strength.strong {
  background: #09884d;
  width: 100%;
}

/* Error States */
.form-control.is-invalid {
  border-color: #ff4757;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23ff4757'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ff4757' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  padding-right: 40px;
}

.invalid-feedback {
  display: block;
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
  animation: fadeIn 0.3s ease;
}

/* Loading State */
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

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .body {
    padding: 15px;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 14px;
  }

  .title p:nth-child(1) {
    font-size: 20px;
  }
}
.form-group {
  position: relative;
}

.form-group button {
  position: absolute;
  right: 12px;
  top: 38px; /* Điều chỉnh vị trí so với label */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.form-group button:hover {
  color: #09884d;
}

.form-group button i {
  font-size: 16px;
}

/* Điều chỉnh padding cho input để tránh icon bị đè */
.form-group input[type="text"],
.form-group input[type="password"] {
  padding-right: 40px;
}
</style>
