<template>
  <Header />
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <ul class="list-group">
          <li
            class="list-group-item"
            data-bs-toggle="collapse"
            href="#collapse1"
            role="button"
            aria-controls="collapse1"
          >
            Sản phẩm
          </li>
          <div class="collapse multi-collapse" id="collapse1">
            <div class="card card-body">
              <ul class="list-group">
                <li class="list-group-item">Quản lý sản phẩm</li>
                <li class="list-group-item">Thêm sản phẩm</li>
              </ul>
            </div>
          </div>
          <li
            class="list-group-item"
            data-bs-toggle="collapse"
            href="#collapse2"
            role="button"
            aria-controls="collapse2"
          >
            Đơn hàng
          </li>
          <div class="collapse multi-collapse" id="collapse2">
            <div class="card card-body">
              <ul class="list-group">
                <li class="list-group-item">Đơn đặt hàng</li>
                <li class="list-group-item">Quản lý vận chuyển</li>
                <li class="list-group-item">Quản lý đơn hoàn trả</li>
              </ul>
            </div>
          </div>
        </ul>
      </div>
      <div class="col-md-8">Nội dung Trang bán hàng</div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  name: "seller",
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
