<template>
  <!-- Modal Register -->
  <b-modal class="modal" tabindex="-1" id="register-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-center">Đăng ký tài khoản</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="first_name" class="form-label">Họ</label>
              <input
                v-model="fromData.first_name"
                type="text"
                class="form-control"
                id="first_name"
                name="first_name"
                required
              />
            </div>
            <div class="mv-3">
              <label for="last_name" class="form-label">Tên</label>
              <input
                v-model="fromData.last_name"
                type="text"
                class="form-control"
                id="last_name"
                name="last_name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="middle_name" class="form-label">Tên đệm</label>
              <input
                v-model="fromData.middle_name"
                type="text"
                class="form-control"
                id="middle_name"
                name="middle_name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email_user" class="form-label">Email</label>
              <input
                v-model="fromData.email_user"
                type="email"
                class="form-control"
                id="email_user"
                name="email_user"
                required
              />
            </div>
            <div class="mb-3">
              <label for="phone_number" class="form-label">Số điện thoại</label>
              <input
                v-model="fromData.phone_number"
                type="number"
                class="form-control"
                id="phone_number"
                name="phone_number"
                required
              />
            </div>
            <div class="mb-3">
              <label for="user_name" class="form-label">Tài khoản</label>
              <input
                v-model="fromData.user_name"
                type="text"
                class="form-control"
                id="user_name"
                name="user_name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                v-model="fromData.password"
                type="password"
                class="form-control"
                id="password"
                name="password"
                required
              />
            </div>

            <div class="mb-3 d-flex justify-content-between">
              <a href="#">Quên mật khẩu?</a>
              <a href="#">Bạn đã có tài khoản?</a>
            </div>
            <div class="modal-footer">
              <button
                type="submit"
                class="btn btn-primary w-100"
                @click="$bvModal.hide('register-modal')"
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import authServices from "@/services/auth.services";
export default {
  name: "RegisterModal",
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
        // Hide register modal and show login modal
        this.$refs.registerModal.hide();
        this.$refs.loginModal.show();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style></style>
