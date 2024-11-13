<template>
  <div class="container mt-5 mb-5">
    <p class="text-product">Sản phẩm khác của shop</p>
    <div class="row">
      <div
        class="col-6 col-md-4 col-lg-2 px-2 py-2 card-main"
        v-for="(product, index) in products"
        :key="product.id"
        @click="gotoDetailProduct(product._id)"
      >
        <div class="card-product background-card">
          <div class="card-header">
            <img
              class="card-product-img"
              :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
              alt=""
            />
            <div
              class="icon-heart"
              @click.stop="toggleHeart(index, product._id)"
            >
              <i
                :class="[
                  'fa-solid fa-heart',
                  { 'active-heart': product.isFavorite },
                ]"
              ></i>
            </div>
          </div>
          <div class="card-product-body d-flex align-items-center">
            <span class="card-product-price">{{
              getPrice(product._id).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }}</span>
            <!-- <span class="card-product-price-reduced">400.3000đ</span> -->
          </div>
          <div class="card-product-footer">
            <span class="text-product-footer"
              >{{ truncateName(product.NAME_PRODUCT) }}
            </span>
            <div class="star-rating" v-if="productReviews[product._id] > 0">
              <span>
                {{ productReviews[product._id].toFixed(1) }}
              </span>

              <i class="fa-solid fa-star"></i>
            </div>

            <p class="number-max">
              <i class="fa-solid fa-location-dot"></i>
              {{ addressShop[product._id] }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <VPagination
      v-model="page"
      :pages="currentMaxPage"
      :range-size="4"
      active-color="#DCEDFF"
      @update:modelValue="onPageChange"
    />
  </div>
</template>

<script>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import priceServices from "@/services/price.services";
import productServices from "@/services/product.services";
import favoriteServices from "@/services/favorite.services";
import reviewServices from "@/services/review.services";
import getCookie from "@/utils/getCookie";
import isTokenValid from "@/utils/isTokenValid";
import trumCatName from "@/utils/trumCatName";
import Swal from "sweetalert2";
import userServices from "@/services/user.services";
import addressServices from "@/services/address.services";
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      prices: [], // Lưu trữ giá cho từng sản phẩm
      products: [],
      productReviews: [],
      addressShop: [],
      page: 1,
      limit: 4,
      currentMaxPage: 1,
    };
  },

  components: {
    VPagination,
  },
  async created() {
    setTimeout(async () => {
      await this.getProduct();
      await this.getReviewProductsById();
      await this.getAddressShop();
      console.log("dữ liệu nhận prop", this.product.ACCOUNT__ID);
    }, 300);
  },
  methods: {
    async getProduct() {
      try {
        const response = await productServices.getProductShopByIdAccount(
          this.product.ACCOUNT__ID,
          this.page,
          this.limit
        );
        if (response && response.data) {
          const productsWithFavorites = await Promise.all(
            response.data.map(async (product) => {
              // Lấy thông tin yêu thích (favorite) của sản phẩm
              const responseFavorite = await this.getFavorite(product._id);

              // Gán giá trị IS_FAVORITE vào biến isFavorite của từng sản phẩm
              product.isFavorite = responseFavorite
                ? responseFavorite.IS_FAVORITE
                : false; // Mặc định là false nếu không có thông tin yêu thích

              return product; // Trả về sản phẩm sau khi đã gán biến isFavorite
            })
          );

          // Cập nhật danh sách sản phẩm với trạng thái yêu thích
          this.products = productsWithFavorites;
          console.log("dữ liệu sản phẩm trang chủ", this.products);

          // Sau khi cập nhật danh sách sản phẩm, tiếp tục gọi hàm lấy giá
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
      return trumCatName(name);
    },
    async toggleHeart(index, productId) {
      const product = this.products[index];
      product.isFavorite = !product.isFavorite; // Đảo ngược trạng thái isFavorite

      // Thực hiện thêm hoặc xóa sản phẩm yêu thích dựa trên trạng thái hiện tại
      if (product.isFavorite) {
        await this.addFavorite(productId);
      } else {
        await this.removeFavorite(productId);
      }
    },
    async addFavorite(productId) {
      try {
        await favoriteServices.addFavorite(productId);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Thêm sản phẩm yêu thích thành công",
        });
      } catch (error) {
        console.error(error);
      }
    },
    async removeFavorite(productId) {
      try {
        await favoriteServices.updateFavorite(productId);
      } catch (error) {
        console.error(error);
      }
    },
    async getFavorite(productId) {
      try {
        const response = await favoriteServices.getFavorite(productId);
        if (
          response &&
          response.data &&
          response.data.IS_FAVORITE !== undefined
        ) {
          console.log("dữ liệu getFavorite", response.data);
          return response.data;
        }
        return null; // Nếu không có dữ liệu yêu thích
      } catch (error) {
        console.error(error);
        return null; // Trả về null nếu có lỗi
      }
    },
    async getReviewProductsById() {
      try {
        for (const product of this.products) {
          const rating = await reviewServices.getReviewsByProductId(
            product._id
          );
          this.productReviews[product._id] = rating.data.averageRating;
        }
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
    async getAddressShop() {
      try {
        for (const product of this.products) {
          const responseProduct = await productServices.getById(product._id);
          const responseUserByAccount = await userServices.getUserByAccountId(
            responseProduct.data.ACCOUNT__ID
          );

          const responseUserByAddress =
            await addressServices.getAddressByUserId(
              responseUserByAccount.data[0].user._id
            );

          this.addressShop[product._id] =
            responseUserByAddress.data[0].PROVINCE;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async onPageChange(newPage) {
      if (newPage <= this.currentMaxPage) {
        this.page = newPage;
        await this.getVoucher();
      }
    },
  },
};
</script>

<style scoped>
.star-rating i {
  color: #ffc300;
  font-size: 13px;
}
.star-rating span {
  font-size: 13px;
}

.text-product {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #2c3e50;
  position: relative;
  padding-left: 15px;
}

.text-product::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #09884d;
  border-radius: 2px;
}

.card-main {
  transition: all 0.3s ease;
}

.card-main:hover {
  transform: translateY(-5px);
}

.card-product {
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  overflow: hidden;
  width: 210px;
  min-height: 370px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #ffffff;
  position: relative;
}

.background-card {
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.card-product:hover {
  border: 2px solid #09884d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(9, 136, 77, 0.15);
}

.card-header {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.card-product-img {
  width: 210px;
  height: 210px;
  object-fit: cover;
  transition: all 0.5s ease;
}

.card-product:hover .card-product-img {
  transform: scale(1.08);
}

.icon-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 2;
}

.icon-heart:hover {
  transform: scale(1.1);
}

.icon-heart i {
  color: #999;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-heart i.active-heart {
  color: #ff4757;
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.card-product-body {
  padding: 15px;
  background: #ffffff;
  border-bottom: 1px solid #f0f2f5;
}

.card-product-price {
  color: #09884d;
  font-size: 20px;
  font-weight: 700;
  display: inline-block;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.card-product-price-reduced {
  font-size: 13px;
  margin-left: 8px;
  text-decoration: line-through;
  color: #999;
  font-weight: 400;
}

.card-product-footer {
  padding: 12px 15px;
  background: #ffffff;
}

.text-product-footer {
  font-size: 14px;
  line-height: 1.4;
  color: #2c3e50;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.number-max {
  padding-top: 10px;
  margin-bottom: 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.number-max i {
  color: #09884d;
  font-size: 12px;
}

/* Loading state animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.card-product.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.card-product:hover::before {
  opacity: 1;
  left: -20px;
}

/* Sale badge */
.card-product.on-sale::after {
  content: "Giảm giá";
  position: absolute;
  top: 20px;
  right: 10px;
  background: #ff4757;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(255, 71, 87, 0.2);
}

/* Hover effect for location */
.number-max:hover {
  color: #09884d;
}

.number-max:hover i {
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Out of stock overlay */
.card-product.out-of-stock::before {
  content: "Hết hàng";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 2;
}

.card-product.out-of-stock .card-product-img {
  opacity: 0.5;
}
</style>
