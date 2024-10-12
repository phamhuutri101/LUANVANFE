<template>
  <div class="col-md-9 background-component p-4">
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
.margin {
  margin: 0 15px 0 5px;
}
.text-information {
  color: #555555cc;
}
.text-content {
  color: #333;
}
.inputWrapper {
  height: 37px;

  line-height: 37px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  /*Using a background color, but you can use a background image to represent a button*/
  background-color: #ddf;
}
.fileInput {
  cursor: pointer;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  /*This makes the button huge. If you want a bigger button, increase the font size*/
  font-size: 50px;
  /*Opacity settings for all browsers*/
  opacity: 0;
  -moz-opacity: 0;
  filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0);
}
</style>
