<template>
  <Header />
  <div class="container">
    <div class="main-content">
      <!-- Main Content Area -->
      <div class="content-area row">
        <!-- Shop Info Section -->
        <div class="shop-info col-12">
          <div class="container-fluid">
            <div class="flex items-center justify-between">
              <div class="shop-profile">
                <h1 class="shop-name">{{ nameShop }}</h1>
              </div>
              <div class="shop-stats flex items-center space-x-6">
                <div class="stat-item">
                  <i class="fa-solid fa-box"></i>
                  <span>Sản phẩm: {{ totalProductShop }}</span>
                </div>
                <button class="chat-btn">
                  <i class="fa-solid fa-comment"></i>
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <Voucher :ID_ACCOUNT="this.$route.params.id" />
        </div>
        <div class="col-3">
          <!-- Sidebar Categories -->
          <div class="sidebar">
            <div class="category-menu">
              <h3 class="menu-title">
                <i class="fa-solid fa-bars"></i>
                Danh Mục
              </h3>
              <ul class="category-list">
                <li class="category-item">
                  <a class="category-link"> tất cả </a>
                </li>
                <li class="category-item">
                  <a class="category-link"> Ô Tô & Xe Máy & Xe Đạp </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-9">
          <!-- Filter Section -->
          <div class="filter-section">
            <div class="filter-wrapper">
              <span class="sort-label">Sắp xếp theo</span>
              <div class="filter-buttons">
                <div class="price-filter">
                  <select v-model="selectedPrice" class="price-select">
                    <option value="">Giá</option>
                    <option value="asc">Giá: Thấp đến Cao</option>
                    <option value="desc">Giá: Cao đến Thấp</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-section">
            <div class="products-grid">
              <div
                v-for="(product, index) in products"
                :key="product._id"
                class="product-card"
                @click="gotoDetailProduct(product._id)"
              >
                <div class="card-header">
                  <img
                    :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                    :alt="product.NAME_PRODUCT"
                    class="product-image"
                  />

                  <button
                    class="favorite-btn"
                    @click.stop="toggleHeart(index, product._id)"
                  >
                    <i
                      class="fa-solid fa-heart"
                      :class="{ active: product.isFavorite }"
                    ></i>
                  </button>
                </div>

                <div class="card-content">
                  <div class="price-section">
                    <span class="current-price">
                      {{
                        getPrice(product._id).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      }}
                    </span>
                    <span class="original-price">400.000đ</span>
                  </div>

                  <h3 class="product-name">
                    {{ truncateName(product.NAME_PRODUCT) }}
                  </h3>

                  <div v-if="productReviews[product._id] > 0" class="rating">
                    <span>{{ productReviews[product._id].toFixed(1) }}</span>
                    <i class="fa-solid fa-star"></i>
                  </div>

                  <div class="location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ addressShop[product._id] }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination-wrapper">
              <VPagination
                v-model="page"
                :pages="currentMaxPage"
                :range-size="4"
                active-color="#DCEDFF"
                @update:modelValue="onPageChange"
              />
            </div>
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
import Carousel from "@/components/user/DetailView/Carousel.vue";
import InfoProduct from "@/components/user/DetailView/InfoProduct.vue";
import productServices from "@/services/product.services";
import Rating from "@/components/user/DetailView/Rating.vue";
import Voucher from "@/components/user/detailShop/voucher.vue";
import priceServices from "@/services/price.services";
import favoriteServices from "@/services/favorite.services";
import reviewServices from "@/services/review.services";
import getCookie from "@/utils/getCookie";
import isTokenValid from "@/utils/isTokenValid";
import trumCatName from "@/utils/trumCatName";
import Swal from "sweetalert2";
import userServices from "@/services/user.services";
import addressServices from "@/services/address.services";

import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import shopServices from "@/services/shop.services";

export default {
  components: {
    Carousel,
    InfoProduct,
    Header,
    Footer,
    Rating,
    Voucher,
    VPagination,
  },
  name: "ShopDetail",
  data() {
    return {
      page: 1,
      limit: 4,
      currentMaxPage: 1,
      productReviews: [],
      addressShop: [],
      products: [],
      prices: [],
      shop: {
        name: "ESSAGER flagship store",
        logo: "/path-to-logo.jpg",
        lastActive: "2 phút trước",
        products: 148,
        followers: "6,4k",
        rating: 4.9,
        totalRatings: "7k Đánh Giá",
        joinDate: "31 Tháng Trước",
        responseRate: "100%",
      },
      dataUser: {},
      totalProductShop: "",
      totalRatingShop: "",
      nameShop: "",
    };
  },

  async created() {
    const AccountId = this.$route.params.id;
    await this.getProductShop(AccountId);
    await this.getReviewProductsById();
    await this.getAddressShop();
    await this.getUserByAccountId(AccountId);
    await this.getTotalNumberShop(AccountId);
    await this.getTotalRatingShop(AccountId);
    await this.getNameShopByAccountId(AccountId);
  },

  methods: {
    async getNameShopByAccountId(AccountId) {
      const response = await shopServices.getNameShopByAccountId(AccountId);
      if (response && response.data) {
        this.nameShop = response.data;
      }
    },
    async getUserByAccountId(AccountId) {
      const response = await userServices.getUserByAccountId(AccountId);
      if (response && response.data) {
        this.dataUser = response.data[0];
      }
    },
    async getTotalNumberShop(AccountId) {
      const response = await productServices.getTotalProductShop(AccountId);
      if (response && response.data) {
        this.totalProductShop = response.data;
      }
    },
    async getTotalRatingShop(AccountId) {
      const response = await reviewServices.getTotalReviewsShop(AccountId);
      if (response && response.data) {
        this.totalRatingShop = response.data;
      }
    },
    async getProductShop(AccountId) {
      try {
        const response = await productServices.getProductShopByIdAccount(
          AccountId,
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
          // Determine if we are on the last page by checking if we received fewer items than `limit`
          if (this.products.length < this.limit) {
            this.currentMaxPage = this.page;
          } else {
            // Set currentMaxPage to allow for another page
            this.currentMaxPage = this.page + 1;
          }

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
    async onPageChange(newPage) {
      if (newPage <= this.currentMaxPage) {
        this.page = newPage;
        await this.getProductShop();
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
  },
};
</script>

<style scoped>
/* Base styles */
.shop-detail {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

/* Shop header section */
.shop-info {
  background: #ffffff;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.shop-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.shop-name {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  position: relative;
  padding-left: 15px;
}

.shop-name::before {
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

.shop-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}

.stat-item i {
  color: #09884d;
  font-size: 1.1rem;
}

.chat-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #09884d;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chat-btn:hover {
  background: #077a44;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.2);
}

/* Filter section */
.filter-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filter-wrapper {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sort-label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-btn:hover {
  border-color: #09884d;
  color: #09884d;
}

.filter-btn.active {
  background: #09884d;
  color: white;
  border-color: #09884d;
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  width: 210px;
  min-height: 370px;
  transition: all 0.3s ease;
  background: #ffffff;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.product-card:hover {
  border: 2px solid #09884d;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(9, 136, 77, 0.15);
}

.card-header {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.product-image {
  width: 210px;
  height: 210px;
  object-fit: cover;
  transition: all 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.favorite-btn {
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
  border: none;
  cursor: pointer;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn i {
  color: #999;
  font-size: 18px;
  transition: all 0.3s ease;
}

.favorite-btn i.active {
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

.card-content {
  padding: 15px;
  background: #ffffff;
}

.current-price {
  color: #09884d;
  font-size: 20px;
  font-weight: 700;
  display: inline-block;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.original-price {
  font-size: 13px;
  margin-left: 8px;
  text-decoration: line-through;
  color: #999;
  font-weight: 400;
}

.product-name {
  font-size: 14px;
  line-height: 1.4;
  color: #2c3e50;
  font-weight: 500;
  margin: 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.rating span {
  font-size: 13px;
  font-weight: 600;
}

.rating i {
  color: #ffc300;
  font-size: 13px;
}

.location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 12px;
  padding-top: 10px;
  margin-bottom: 0;
}

.location i {
  color: #09884d;
  font-size: 12px;
}

.location:hover {
  color: #09884d;
}

.location:hover i {
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

/* Sidebar styles */
.sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.menu-title {
  padding: 1.25rem;
  margin: 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-title i {
  color: #09884d;
}

.category-list {
  padding: 0.5rem 0;
}

.category-item {
  padding: 0.5rem 1.25rem;
}

.category-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
}

.category-link:hover {
  background: #f8f9fa;
  color: #09884d;
  padding-left: 1.5rem;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .shop-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .product-card {
    width: 100%;
  }
}
</style>
