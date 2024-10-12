<template>
  <div class="col-md-9 background-component p-4">
    <div class="header border-bottom py-4">
      <div class="title d-block">
        <p>Đổi mật khẩu</p>
        <p>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>
    </div>
    <div class="body py-4">
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="currentPassword">Mật khẩu hiện tại:</label>
          <input
            type="password"
            class="form-control"
            id="currentPassword"
            v-model="currentPassword"
            required
          />
        </div>
        <div class="form-group">
          <label for="newPassword">Mật khẩu mới:</label>
          <input
            type="password"
            class="form-control"
            id="newPassword"
            v-model="newPassword"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">xác nhận</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.body {
  max-width: 400px;
  margin: 0 auto;
}
.title p:nth-child(1) {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  margin: 0;
}
.title p:nth-child(2) {
  color: rgba(0, 0, 0, 0.54);
  font-size: 1rem;
  line-height: 1.5rem;
  margin-top: 4px;
}
</style>
