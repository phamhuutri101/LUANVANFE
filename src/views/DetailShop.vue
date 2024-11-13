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
        <div class="col-2">
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

        <div class="col-10">
          <!-- Filter Section -->
          <div class="filter-section">
            <div class="filter-wrapper">
              <span class="sort-label">Sắp xếp theo</span>
              <div class="filter-buttons">
                <button class="filter-btn active">Phổ Biến</button>
                <button class="filter-btn">Mới Nhất</button>
                <button class="filter-btn">Bán Chạy</button>
                <div class="price-filter">
                  <select v-model="selectedPrice" class="price-select">
                    <option value="">Giá</option>
                    <option value="asc">Giá: Thấp đến Cao</option>
                    <option value="desc">Giá: Cao đến Thấp</option>
                  </select>
                  <i class="fa-solid fa-chevron-down"></i>
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
                  <span class="brand-badge">ESSAGER</span>
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
/* Style chung cho toàn bộ trang */
.shop-detail {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* Style cho phần header thông tin shop */
.shop-info {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shop-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

/* Style cho số lượng sản phẩm và nút chat */
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.chat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  transition: all 0.3s ease;
}

.chat-btn:hover {
  background: #f5f5f5;
}

/* Style cho phần filter và sắp xếp sản phẩm */
.filter-section {
  padding: 1rem 0;
}

.filter-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-label {
  color: #666;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #ee4d2d;
  color: white;
  border-color: #ee4d2d;
}

.price-filter {
  position: relative;
}

.price-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  appearance: none;
  background: white;
}

.price-filter i {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

/* Style cho grid hiển thị sản phẩm */
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  position: relative;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.brand-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #ffd700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Style cho nút yêu thích */
.favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.favorite-btn i {
  color: #999;
  transition: all 0.3s ease;
}

.favorite-btn i.active {
  color: #ff4d4f;
}

/* Style cho nội dung sản phẩm */
.card-content {
  padding: 1rem;
}

.price-section {
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ee4d2d;
}

.original-price {
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.product-name {
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Style cho rating và địa chỉ */
.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.rating i {
  color: #ffd700;
}

.location {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #999;
  font-size: 0.75rem;
}

/* Style cho phân trang */
.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

/* PHẦN SIDEBAR DANH MỤC */
/* Container của sidebar */
.sidebar {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
}

/* Menu danh mục */
.category-menu {
  width: 100%;
  margin: 20px 0;
}

/* Tiêu đề "Danh Mục" */
.menu-title {
  font-size: 16px;
  font-weight: 500;
  padding: 15px 20px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

/* Icon trong tiêu đề danh mục */
.menu-title i {
  margin-right: 10px;
  color: #ee4d2d;
}

/* List danh mục */
.category-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Item trong danh mục */
.category-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.category-item:last-child {
  border-bottom: none;
}

/* Link trong mỗi item danh mục */
.category-link {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  color: rgba(0, 0, 0, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.1s cubic-bezier(0.4, 0, 0.6, 1);
}

.category-link:hover {
  color: #ee4d2d;
  background-color: #fef6f5;
}

/* Icon trong link danh mục */
.category-link i {
  margin-right: 12px;
  width: 18px;
  text-align: center;
  font-size: 16px;
  color: #757575;
}

.category-link:hover i {
  color: #ee4d2d;
}

/* Responsive cho grid sản phẩm */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
