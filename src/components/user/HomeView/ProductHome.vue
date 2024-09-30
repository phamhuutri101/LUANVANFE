<template>
  <div class="container mt-5">
    <p class="text-product">Dành cho bạn</p>
    <div class="row">
      <div
        class="col-6 col-md-4 col-lg-2 px-2 py-2 card-main"
        v-for="product in products"
        :key="product.id"
        @click="gotoDetailProduct(product._id)"
      >
        <div class="card-product">
          <div class="card-header">
            <img
              class="card-product-img"
              :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
              alt=""
            />
            <div class="icon-heart">
              <i class="fa-solid fa-heart"></i>
            </div>
          </div>
          <div class="card-product-body d-flex align-items-center">
            <span class="card-product-price">{{
              prices[product._id] || "Đang cập nhật giá"
            }}</span>
            <span class="card-product-price-reduced">400.3000đ</span>
          </div>
          <div class="card-product-footer">
            <span class="text-product-footer">{{ product.NAME_PRODUCT }} </span>
            <p class="number-max">
              <i class="fa-solid fa-location-dot"></i> Hà nội
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import priceServices from "@/services/price.services";
import productServices from "@/services/product.services";
export default {
  data() {
    return {
      prices: [], // Lưu trữ giá cho từng sản phẩm
      products: [],
    };
  },
  async created() {
    await this.loadPrices(); // Gọi hàm để tải giá khi component được tạo
    await this.getProduct();
    console.log(this.products);
  },
  methods: {
    async getProduct() {
      try {
        const response = await productServices.getAllProduct();
        if (response && response.data) {
          this.products = response.data;
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    },
    async loadPrices() {
      // Lặp qua từng sản phẩm và lấy giá
      for (const product of this.products) {
        try {
          const response = await priceServices.getDefaultPrice(product._id);

          if (response && response.data && response.data[0]) {
            this.$set(this.prices, product._id, response.data[0].PRICE_NUMBER);
          } else {
            this.$set(this.prices, product._id, "N/A"); // Nếu không có giá trị
          }
        } catch (error) {
          console.error("Lỗi khi lấy giá cho sản phẩm", product._id, error);
          this.$set(this.prices, product._id, "N/A"); // Đặt giá trị nếu lỗi
        }
      }
    },
    gotoDetailProduct(productId) {
      this.$router.push({ name: "DetailView", params: { id: productId } });
    },
  },
};
</script>

<style scoped>
.text-product {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.card-product {
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  overflow: hidden;
  width: 210px;
}
.card-product-img {
  width: 210px;
  height: 210px;
  object-fit: cover;
}
.card-product-price {
  color: #09884d;
  font-size: 18px;
  font-weight: 700;
}
.card-product-footer,
.card-product-body {
  padding: 5px 10px;
}
.card-product-price-reduced {
  font-size: 12px;
  margin-left: 20px;
  text-decoration: line-through;
}
.text-product-footer {
  font-size: 14px;
}
.card-header {
  position: relative;
}
.icon-heart {
  position: absolute;
  top: 2px;
  right: 2px;
}
.icon-heart i {
  color: red;
  font-size: 20px;
}
.card-product-footer {
  font-size: 14px;
  color: #000000;
  font-weight: 400;
}
.number-max {
  padding-top: 10px;
  font-size: 10px;
  color: #636363;
}
.card-product:hover {
  border: 1px solid #09884d; /* Thay đổi màu viền khi hover */
  transform: scale(1.015);
  transition: 0.2s ease;
  cursor: pointer;
}
</style>
