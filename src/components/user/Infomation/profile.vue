<template>
  <div class="col-md-9 background-component background-height p-4">
    <h2 class="">Hồ Sơ Của Tôi</h2>
    <p class="pb-3 border-bottom">
      Quản lý thông tin hồ sơ để bảo mật tài khoản
    </p>
    <form @submit.prevent="updateInfo()">
      <div class="row pt-3">
        <div class="col-8">
          <div class="row mb-3">
            <label
              for="fullName "
              class="col-md-3 col-form-label text-end text-information"
              >Tên đăng nhập</label
            >
            <div class="col-md-9">
              <span class="text-content">{{ account.USER_NAME }}</span>
            </div>
          </div>
          <div class="row mb-3">
            <label
              for="fullName"
              class="col-md-3 col-form-label text-end text-information"
              >Tên</label
            >
            <div class="col-md-9">
              <input
                type="text"
                class="form-control"
                id="fullName"
                v-model="user.FULL_NAME"
              />
            </div>
          </div>

          <div class="row mb-3">
            <label
              for="email"
              class="col-md-3 col-form-label text-end text-information"
              >Email</label
            >
            <div class="col-md-9">
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="user.EMAIL_USER"
              />
            </div>
          </div>

          <div class="row mb-3">
            <label
              for="phone"
              class="col-md-3 col-form-label text-end text-information"
              >Số điện thoại</label
            >
            <div class="col-md-9">
              <input
                type="text"
                class="form-control"
                id="phone"
                v-model="user.PHONE_NUMBER"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label
              for="phone"
              class="col-md-3 col-form-label text-end text-information"
              >Giới tính</label
            >
            <div class="col-md-9 d-flex align-items-center">
              <input
                type="radio"
                id="html"
                name="male"
                value="Nam"
                v-model="user.GENDER_USER"
              />
              <label for="html" class="margin">Nam</label><br />
              <input
                type="radio"
                id="css"
                name="female"
                value="Nữ"
                v-model="user.GENDER_USER"
              />
              <label for="css" class="margin">Nữ </label><br />
              <input
                type="radio"
                id="javascript"
                name="other"
                value="Khác"
                v-model="user.GENDER_USER"
              />
              <label for="javascript" class="margin">Khác</label>
            </div>
          </div>

          <div class="row">
            <div class="col-md-9 offset-md-3">
              <button type="" class="btn btn-primary">Cập nhật</button>
            </div>
          </div>
        </div>
        <div class="col-4 border-start">
          <div class="mb-3 text-center">
            <div class="">Ảnh đại diện</div>
            <div class="d-flex justify-content-center">
              <img
                :src="user.AVT_URL"
                class="rounded-circle"
                style="width: 150px; height: 150px; object-fit: cover"
                alt="Avatar"
              />
            </div>
            <div class="inputWrapper my-2">
              <span>Cập nhật ảnh</span>
              <input
                type="file"
                @change="uploadFile($event)"
                class="fileInput"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import userServices from "@/services/user.services";
import uploadServices from "@/services/upload.services";
export default {
  name: "UserProfile",
  data() {
    return {
      account: {},
      user: {},

      avatarUrl: null,
    };
  },
  async created() {
    await this.getProfile();
  },
  methods: {
    async getProfile() {
      let idUser;
      const response = await userServices.getUserLogin();
      this.account = response.data;
      idUser = await response.data.USER_ID;

      const user = await userServices.getUserById(idUser);
      this.user = user.data;
    },
    async uploadFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        console.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
        return;
      }

      try {
        const response = await uploadServices.uploadFile(file);
        const updateAVT = { img_url: response.data.url };
        await userServices.updateAVTUser(updateAVT);
        this.getProfile();
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    },
    async updateInfo() {
      let payload = {
        full_name: this.user.FULL_NAME,
        email: this.user.EMAIL_USER,
        gender_user: this.user.GENDER_USER,
        phone_number: this.user.PHONE_NUMBER,
      };

      try {
        await userServices.updateInfo(payload);
        console.log(payload);
      } catch (error) {
        console.error("Failed to update info:", error);
      }
    },
  },
};
</script>

<style scoped>
.background-component {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.background-component:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.background-height {
  min-height: 700px;
}

h2 {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  position: relative;
  padding-left: 15px;
}

h2::before {
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

p {
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 15px;
}

.form-control {
  height: 45px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-control:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 3px rgba(9, 136, 77, 0.1);
  background: #ffffff;
}

.form-control:hover {
  border-color: #09884d;
}

.text-information {
  color: #666;
  font-size: 15px;
  font-weight: 500;
}

.text-content {
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 0;
}

/* Radio buttons styling */
input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #09884d;
  cursor: pointer;
}

.margin {
  margin: 0 20px 0 8px;
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
}

/* Update button */
.btn-primary {
  background-color: #09884d;
  border: none;
  padding: 12px 30px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(9, 136, 77, 0.2);
}

.btn-primary:hover {
  background-color: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Avatar section */
.border-start {
  border-left: 2px solid #f0f2f5 !important;
  padding-left: 30px;
}

.rounded-circle {
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.rounded-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* File input styling */
.inputWrapper {
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  background: #e0f7e9;
  transition: all 0.3s ease;
  border: 2px dashed #09884d;
  text-align: center;
  width: 150px;
  margin: 15px auto;
}

.inputWrapper:hover {
  background: #d0f0e0;
  transform: translateY(-2px);
}

.inputWrapper span {
  color: #09884d;
  font-size: 14px;
  font-weight: 500;
}

.fileInput {
  cursor: pointer;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  font-size: 50px;
  opacity: 0;
}

/* Loading states */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Form row animations */
.row.mb-3 {
  transition: all 0.3s ease;
}

.row.mb-3:hover {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 5px 0;
}

/* Success message animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  animation: fadeInUp 0.5s ease;
  color: #09884d;
  background: #e0f7e9;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Error state */
.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 13px;
  margin-top: 4px;
  animation: fadeInUp 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .border-start {
    border-left: none !important;
    border-top: 2px solid #f0f2f5 !important;
    margin-top: 20px;
    padding-top: 20px;
  }

  .text-end {
    text-align: left !important;
  }

  .offset-md-3 {
    margin-left: 0;
  }
}
</style>
