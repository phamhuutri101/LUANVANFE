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
              getPrice(product._id).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }}</span>
            <span class="card-product-price-reduced">400.3000đ</span>
          </div>
          <div class="card-product-footer">
            <span class="text-product-footer"
              >{{ truncateName(product.NAME_PRODUCT) }}
            </span>
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
    await this.getProduct();
  },
  methods: {
    async getProduct() {
      try {
        const response = await productServices.getAllProduct();
        if (response && response.data) {
          this.products = response.data;
          await this.getPriceProduct();
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    },
    async getPriceProduct() {
      try {
        // Kiểm tra nếu this.products là một mảng
        if (Array.isArray(this.products)) {
          const prices = {};
          for (const product of this.products) {
            const response = await priceServices.getDefaultPrice(product._id);
            if (response && response.data && response.data[0]) {
              prices[product._id] = response.data[0].PRICE_NUMBER;
            } else {
              console.error("Unexpected response structure:", response);
            }
          }
          this.prices = prices; // Cập nhật trạng thái `prices`
        } else {
          console.error("products is not an array:", this.products);
        }
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    getPrice(productId) {
      const price = this.prices[productId];
      if (price) {
        return price;
      } else {
        return "Đang cập nhật giá";
      }
    },
    gotoDetailProduct(productId) {
      this.$router.push({ name: "DetailView", params: { id: productId } });
    },
    truncateName(name) {
      if (name.length > 25) {
        return name.substring(0, 25) + "...";
      }
      return name;
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
