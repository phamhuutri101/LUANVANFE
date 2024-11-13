<template>
  <div class="col-md-9 background-component background-height p-4">
    <p class="text-product">Dành cho bạn</p>
    <div class="row">
      <div
        class="col-3 card-main"
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
import favoriteServices from "@/services/favorite.services";

export default {
  name: "favorite",
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
        const response = await favoriteServices.getProductFavorite();

        if (response && response.data) {
          // Lặp qua từng sản phẩm trả về từ API
          const productsWithFavorites = await Promise.all(
            response.data.map(async (favoriteItem) => {
              // Mảng PRODUCT từ mỗi đối tượng favoriteItem
              const productArray = favoriteItem.PRODUCT;

              // Lặp qua từng sản phẩm trong mảng PRODUCT
              const products = productArray.map(async (product) => {
                // Lấy thông tin yêu thích (favorite) của sản phẩm
                const responseFavorite = await this.getFavorite(product._id);

                // Gán giá trị IS_FAVORITE vào biến isFavorite của từng sản phẩm
                product.isFavorite = responseFavorite
                  ? responseFavorite.IS_FAVORITE
                  : false; // Mặc định là false nếu không có thông tin yêu thích

                return product; // Trả về sản phẩm sau khi đã gán biến isFavorite
              });

              // Đợi tất cả các sản phẩm trong mảng xử lý xong
              const resolvedProducts = await Promise.all(products);

              return resolvedProducts;
            })
          );

          // Gộp tất cả các mảng sản phẩm từ từng đối tượng vào một mảng lớn
          const flatProducts = productsWithFavorites.flat();

          // Cập nhật danh sách sản phẩm với trạng thái yêu thích
          this.products = flatProducts;
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
      if (name.length > 25) {
        return name.substring(0, 25) + "...";
      }
      return name;
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
  },
};
</script>

<style scoped>
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

/* Filter Container Styles */
.filter-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f2f5;
  font-weight: 600;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.price-range input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.price-range input:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 2px rgba(9, 136, 77, 0.1);
  outline: none;
}

.form-check {
  margin-bottom: 10px;
}

.form-check-label {
  color: #2c3e50;
  font-size: 14px;
  padding-left: 5px;
  cursor: pointer;
}

.form-check-input {
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #09884d;
  border-color: #09884d;
}

/* Button Styles */
.btn-filter,
.btn-apply {
  background-color: #09884d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-filter:hover,
.btn-apply:hover {
  background-color: #076d3e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.2);
}

.btn-sort {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-sort:hover {
  border-color: #09884d;
  color: #09884d;
}

/* Product Card Content Styles */
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

/* Search Results Heading */
.search-result {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
  position: relative;
  padding-left: 15px;
}

.search-result::before {
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

/* Animations */
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

.height-search {
  min-height: 700px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .card-product {
    width: 100%;
  }

  .card-product-img {
    width: 100%;
    height: auto;
  }

  .filter-container {
    margin-bottom: 20px;
  }
}
</style>
