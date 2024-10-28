<template>
  <div class="container">
    <div class="product">
      <div class="header pb-4 d-flex justify-content-between">
        <h4>Quản lý sản phẩm</h4>
      </div>

      <div class="top-product">
        <div class="row">
          <div class="col-3 text-center">Thông tin sản phẩm</div>
          <div class="col-3 text-center">Giá</div>
          <div class="col-3 text-center">Kho</div>
          <div class="col-3 text-center">Thao tác</div>
        </div>
      </div>
      <div class="bottom-product">
        <div
          class="row border-bottom py-3"
          v-for="item in products"
          :key="item._id"
        >
          <div class="col-3 text-start">
            <img
              :src="item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
              alt=""
              class="img-product"
            />

            <span class="px-2">{{ truncateName(item.NAME_PRODUCT) }}</span>
          </div>
          <div class="col-3 text-center">
            {{
              getPrice(item._id).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }}
          </div>
          <div class="col-3 text-center">
            {{ item.NUMBER_INVENTORY_PRODUCT }}
          </div>
          <div class="col-3 text-center">
            <i class="fa-solid fa-pen-to-square"></i> |
            <i class="fa-solid fa-trash" @click="removeProduct(item._id)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PriceService from "@/services/price.services";
import productServices from "@/services/product.services";
export default {
  data() {
    return {
      prices: [],
      products: [],
    };
  },
  created() {
    this.getProduct();
  },
  methods: {
    async getProduct() {
      try {
        const response = await productServices.getProductShop();
        if (response && response.data) {
          this.products = response.data;

          await this.getPriceProduct();
        }
      } catch (error) {
        console.error(error);
      }
    },
    truncateName(name) {
      if (name.length > 25) {
        return name.substring(0, 25) + "...";
      }
      return name;
    },
    async getPriceProduct() {
      try {
        // Kiểm tra nếu this.products là một mảng
        if (Array.isArray(this.products)) {
          const prices = {};
          for (const product of this.products) {
            const response = await PriceService.getDefaultPrice(product._id);
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
    async removeProduct(productId) {
      this.products = this.products.filter(
        (product) => product._id !== productId
      );
      try {
        await productServices.deleteProduct(productId);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.product {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #eeeeee;
  height: 100vh;
}
.img-product {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
}

.top-product {
  border: 1px solid #eeeeee;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 15px;
  background: #fbfcfd;
}
.bottom-product {
  border: 1px solid #eeeeee;
  border-top-style: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 15px;
}
</style>
