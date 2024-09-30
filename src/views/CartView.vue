<template>
  <Header />
  <div class="container pt-3">
    <div class="row">
      <div class="col-9">
        <div class="detail-product">
          <div class="name-shop">
            <p>Tên shop</p>
          </div>
          <div
            class="product d-flex justify-content-between align-items-center"
          >
            <div class="info-product d-flex">
              <div class="img-product">
                <img
                  src="../../public/img/product/pexels-karolina-grabowska-4495705.jpg"
                  alt=""
                />
              </div>
              <div class="name-product">
                <span>Bộ Quần Áo Bóng Đá Nam Nữ MAN. CITY TRẮNG</span>
              </div>
            </div>
            <div class="key-vale">
              <div class="key">
                <span>Trắng</span>
              </div>
              <div class="value">
                <span>XL</span>
              </div>
            </div>
            <div class="price">
              <span>200,000 đ</span>
            </div>
            <div class="number">
              <button class="number-reduce">-</button>
              <span class="number-product">1</span>
              <button class="number-increase">+</button>
            </div>
            <div class="total">
              <span>200,000đ</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="bill">
          <div class="title-bill">
            <span class="title">Giỏ Hàng</span>
            <div class="row title-body">
              <div class="col-6">
                <span class="title-body-text">Số lượng</span>
              </div>
              <div class="col-6 text-end"><span>1</span></div>
            </div>
            <div class="row pb-3">
              <div class="col-6">
                <span class="title-body-text">Tạm tính</span>
              </div>
              <div class="col-6 text-end"><span>200.000đ</span></div>
            </div>
          </div>
          <div class="body-bill">
            <div class="discount">
              <input
                type="text"
                class="input-discount w-100"
                placeholder="Nhập mã giảm giá"
              />
              <div class="row py-3">
                <div class="col-6">
                  <span class="discount-text">Tổng giảm giá</span>
                </div>
                <div class="col-6 text-end"><span>0đ</span></div>
              </div>
            </div>
          </div>

          <div class="footer-bill">
            <div class="row py-3">
              <div class="col-6">
                <span class="footer-bill-text">Tổng tiền</span>
              </div>
              <div class="col-6 text-end">
                <span class="footer-bill-price">200.000đ</span>
              </div>
            </div>
            <button class="buy" type="submit">Mua hàng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  name: "CartView",
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
.background {
  background-color: #f5f5f5;
}
.img-product img {
  width: 80px;
  height: 80px;
}
.name-shop {
  font-size: 18px;

  border-bottom: solid 1px #ededed;
}
.name-product {
  width: 200px;
  overflow: hidden;
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.87);
}
.product {
  padding-top: 10px;
}
.number {
  display: flex;
  align-items: center;
}

.number button {
  background-color: #ddd;
  border: none;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.number button:hover {
  background-color: #ccc;
}

.number-product {
  width: 50px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #ddd;
}
.detail-product {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}
.bill {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
.title-bill,
.discount {
  border-bottom: dashed 1px #c0c0c0;
  margin-bottom: 20px;
}

.title-bill .title {
  font-size: 18px;
  text-transform: capitalize;

  font-weight: 700;
}
.title-body {
  padding: 10px 0;
}
.title-body-text,
.discount-text {
  color: #797979;
  font-size: 16px;
  font-weight: 300;
}

.input-discount {
  border: 1px dashed #e78438;
  background: #fdf2eb;
  height: 35px;
}
.input-discount::placeholder {
  color: #e88438;
  font-size: 14px;
}
.input-discount:focus {
  outline: none;
  border: 1px dashed #e78438;
}
.footer-bill-text {
  font-size: 16px;
  color: #000;
  font-weight: 600;
}
.footer-bill-price {
  font-size: 22px;
  font-weight: 600;
  color: #09884d;
}
.footer-bill-text {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  height: 100%; /* Đảm bảo phần tử có chiều cao đầy đủ của parent */
}
.buy {
  background-color: #09884d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}
</style>
