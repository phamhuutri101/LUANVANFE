<template>
  <Header />
  <div class="container mt-5">
    <div class="row">
      <!-- Thanh menu bên trái -->
      <div class="col-md-3">
        <ul class="list-group">
          <li class="list-group-item active">Thông tin tài khoản</li>
          <li class="list-group-item">Quản lý đơn hàng</li>
          <li class="list-group-item">Sổ địa chỉ</li>
          <li class="list-group-item">Sản phẩm yêu thích</li>
          <li class="list-group-item">Thông báo của tôi</li>
        </ul>
      </div>

      <!-- Nội dung chính -->
      <div class="col-md-9">
        <h2 class="mb-4">Thông tin cá nhân</h2>
        <form>
          <div class="row mb-3">
            <div class="col-md-2">Ảnh đại diện</div>
            <div class="col-md-10">
              <img src="" alt="Ảnh đại diện" class="img-fluid" />
            </div>
          </div>

          <div class="row mb-3">
            <label for="fullName" class="col-md-2 col-form-label"
              >Họ và tên</label
            >
            <div class="col-md-10">
              <input
                type="text"
                class="form-control"
                id="fullName"
                value="Nguyễn Văn A"
              />
            </div>
          </div>

          <div class="row mb-3">
            <label for="email" class="col-md-2 col-form-label">Email</label>
            <div class="col-md-10">
              <input
                type="email"
                class="form-control"
                id="email"
                value="nguyenvana@gmail.com"
              />
            </div>
          </div>

          <div class="row mb-3">
            <label for="phone" class="col-md-2 col-form-label"
              >Số điện thoại</label
            >
            <div class="col-md-10">
              <input
                type="text"
                class="form-control"
                id="phone"
                value="0123456789"
              />
            </div>
          </div>

          <div class="row mb-3">
            <label for="address" class="col-md-2 col-form-label">Địa chỉ</label>
            <div class="col-md-10">
              <input
                type="text"
                class="form-control"
                id="address"
                value="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-10 offset-md-2">
              <button type="submit" class="btn btn-primary">Cập nhật</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  name: "information",
  components:{
    Header,
    Footer
  }
};
</script>

<style scoped></style>
