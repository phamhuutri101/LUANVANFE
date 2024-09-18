<template>
  <!-- Modal Login -->
  <b-modal class="modal" tabindex="-1" id="login-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-center">Đăng nhập tài khoản</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="username" class="form-label">Tên đăng nhập</label>
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                required
              />
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe" />
              <label class="form-check-label" for="rememberMe">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div class="mb-3 d-flex justify-content-between">
              <a href="#">Quên mật khẩu?</a>
              <a href="#" @click="switchToRegister">Bạn chưa có tài khoản?</a>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100">Đăng nhập</button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "LoginModal",
};
</script>

<style></style>
