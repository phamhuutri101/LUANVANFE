<template>
  <Header />
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 col-md-3 mb-4">
        <h1>Bộ lọc</h1>
        <div class="filter-container">
          <div class="filter-section">
            <h3>Khoảng giá</h3>
            <div class="price-range">
              <input
                type="number"
                v-model="minPrice"
                placeholder="Giá tối thiểu"
                class="form-control"
              />
              <span>-</span>
              <input
                type="number"
                v-model="maxPrice"
                placeholder="Giá tối đa"
                class="form-control"
              />
            </div>
          </div>

          <div class="filter-section">
            <h3>Nơi bán</h3>
            <div
              v-for="location in addressShopProduct"
              :key="location"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="location"
                :value="location.PROVINCE"
                v-model="selectedLocations"
              />
              <label class="form-check-label" :for="location">{{
                location.PROVINCE
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-9 height-search">
        <div class="mb-4">
          <p class="search-result">
            Kết quả tìm kiếm cho từ khoá '{{ searchTerm }}'
          </p>
          <div class="d-flex flex-wrap">
            <button class="btn btn-light btn-sort me-2 mb-2">
              Sắp xếp theo
            </button>

            <select
              class="form-select btn-sort mb-2"
              style="width: auto"
              @change="sortProducts"
            >
              <option value="">Sắp xếp</option>
              <option value="name-asc">Tên (A-Z)</option>
              <option value="name-desc">Tên (Z-A)</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div
            class="col-3 px-2 py-2 card-main"
            v-for="(product, index) in filteredProducts"
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
                <div class="star-rating" v-if="productReviews[product._id] > 0">
                  <span>
                    {{ productReviews[product._id].toFixed(1) }}
                  </span>

                  <i class="fa-solid fa-star"></i>
                </div>
                <p class="number-max">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ product.addressShop }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import searchServices from "@/services/search.services";
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import favoriteServices from "@/services/favorite.services";
import priceServices from "@/services/price.services";
import productServices from "@/services/product.services";
import addressServices from "@/services/address.services";
import userServices from "@/services/user.services";
import reviewServices from "@/services/review.services";
export default {
  name: "SearchView",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      searchTerm: this.$route.query.search || "",
      products: [],
      prices: [],
      addressShopProduct: [],
      // lọc
      minPrice: null,
      maxPrice: null,

      selectedLocations: [],

      selectedCategories: [],
      filteredProducts: [],
      productReviews: [],
    };
  },
  async created() {
    await this.searchResult();
    await this.getAddressShop();
    await this.getReviewProductsById();
  },
  watch: {
    // Lắng nghe sự thay đổi của từ khóa tìm kiếm
    "$route.query.search": {
      handler(newSearchTerm) {
        this.searchTerm = newSearchTerm;
        this.searchResult();
      },
      immediate: true, // Gọi ngay lập tức khi khởi tạo
      minPrice() {
        this.applyFilters();
      },
      maxPrice() {
        this.applyFilters();
      },
      selectedLocations: {
        handler() {
          this.applyFilters();
        },
        deep: true,
      },
    },
    minPrice(val) {
      this.applyFilters();
    },
    maxPrice(val) {
      this.applyFilters();
    },
    // Theo dõi sự thay đổi của địa điểm bán
    selectedLocations: {
      handler() {
        this.applyFilters();
      },
      deep: true, // Để phát hiện mọi thay đổi bên trong mảng
    },
  },
  methods: {
    async getAddressShop() {
      const response = await productServices.getAddressShopProduct();
      if (response && response.success === true) {
        this.addressShopProduct = response.data;
        console.log("lấy địa chỉ shop", this.addressShopProduct);
      }
    },
    async searchResult() {
      const keyWords = this.searchTerm;
      if (keyWords) {
        const response = await searchServices.searchByKeyword(keyWords);

        if (response) {
          const productsWithFavorites = await Promise.all(
            response.data.map(async (product) => {
              const responseFavorite = await this.getFavorite(product._id);
              const responseUserByAccount =
                await userServices.getUserByAccountId(product.ACCOUNT__ID);
              const responseUserByAddress =
                await addressServices.getAddressByUserId(
                  responseUserByAccount.data[0].user._id
                );
              product.addressShop = responseUserByAddress.data[0].PROVINCE;
              product.isFavorite = responseFavorite
                ? responseFavorite.IS_FAVORITE
                : false;
              console.log(product);
              return product;
            })
          );
          this.products = productsWithFavorites || [];
          this.filteredProducts = [...this.products]; // Khởi tạo filteredProducts
        } else {
          this.products = [];
          this.filteredProducts = [];
        }
        await this.getPriceProduct();
        this.applyFilters(); // Áp dụng bộ lọc sau khi tìm kiếm
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
          console.error(" products is not an array:", this.products);
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
    sortProducts(event) {
      const sortBy = event.target.value;

      if (sortBy === "name-asc") {
        this.filteredProducts.sort((a, b) =>
          a.NAME_PRODUCT.localeCompare(b.NAME_PRODUCT)
        );
      } else if (sortBy === "name-desc") {
        this.filteredProducts.sort((a, b) =>
          b.NAME_PRODUCT.localeCompare(a.NAME_PRODUCT)
        );
      } else if (sortBy === "price-asc") {
        this.filteredProducts.sort(
          (a, b) => this.getPrice(a._id) - this.getPrice(b._id)
        );
      } else if (sortBy === "price-desc") {
        this.filteredProducts.sort(
          (a, b) => this.getPrice(b._id) - this.getPrice(a._id)
        );
      }

      console.log("Danh sách sản phẩm sau khi sắp xếp:", this.filteredProducts);
    },

    // lọc
    applyPriceFilter() {
      this.applyFilters();
    },
    applyFilters() {
      this.filteredProducts = this.products.filter((product) => {
        const price = this.getPrice(product._id);
        const priceMatch =
          (this.minPrice === null || price >= this.minPrice) &&
          (this.maxPrice === null || price <= this.maxPrice);

        const locationMatch =
          this.selectedLocations.length === 0 ||
          this.selectedLocations.includes(product.addressShop);

        const categoryMatch =
          this.selectedCategories.length === 0 ||
          this.selectedCategories.includes(product.CATEGORY);

        return priceMatch && locationMatch && categoryMatch;
      });

      console.log("Sản phẩm sau khi lọc:", this.filteredProducts);
    },
    resetFilters() {
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedLocations = [];
      this.selectedCategories = [];
      this.filteredProducts = [...this.products];
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Search results text */
.search-result {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Filter sidebar styles */
.filter-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #09884d;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.price-range input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.price-range input:focus {
  outline: none;
  border-color: #09884d;
  box-shadow: 0 0 0 2px rgba(9, 136, 77, 0.1);
}

/* Product card styles */
.card-main {
  transition: transform 0.2s;
  margin-bottom: 1.5rem;
}

.card-product {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card-product:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #09884d;
}

.card-header {
  position: relative;
  overflow: hidden;
}

.card-product-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-product:hover .card-product-img {
  transform: scale(1.05);
}

.icon-heart {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.icon-heart i {
  color: #9ca3af;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.icon-heart:hover {
  transform: scale(1.1);
}

.icon-heart i.active-heart {
  color: #ef4444;
}

.card-product-body {
  padding: 10px;
}

.card-product-price {
  color: #09884d;
  font-size: 1.25rem;
  font-weight: 700;
}

.card-product-footer {
  padding: 10px;
  border-top: 1px solid #f3f4f6;
}

.text-product-footer {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.number-max {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.number-max i {
  color: #09884d;
}

/* Sort button styles */
.btn-sort {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-sort:hover {
  border-color: #09884d;
  color: #09884d;
}

.form-select.btn-sort {
  cursor: pointer;
  padding-right: 2rem;
}

/* Checkbox styles */
.form-check {
  margin-bottom: 0.5rem;
}

.form-check-input {
  border-color: #d1d5db;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #09884d;
  border-color: #09884d;
}

.form-check-label {
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  padding-left: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-product {
    width: 100%;
  }

  .filter-container {
    margin-bottom: 1.5rem;
  }

  .price-range {
    flex-direction: column;
  }

  .price-range input {
    width: 100%;
  }
}

/* Height adjustments */
.height-search {
  min-height: 800px;
  padding: 1rem;
}

/* Background colors */
.background-card {
  background-color: white;
}
</style>
