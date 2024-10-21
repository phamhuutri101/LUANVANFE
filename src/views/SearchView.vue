<template>
  <Header />
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 col-md-4 mb-4">
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
            <button @click="applyPriceFilter" class="btn btn-filter">
              Áp dụng giá
            </button>
          </div>

          <div class="filter-section">
            <h3>Nơi bán</h3>
            <div
              v-for="location in locations"
              :key="location"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="location"
                :value="location"
                v-model="selectedLocations"
              />
              <label class="form-check-label" :for="location">{{
                location
              }}</label>
            </div>
          </div>

          <div class="filter-section">
            <h3>Danh mục</h3>
            <div
              v-for="category in categories"
              :key="category"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="category"
                :value="category"
                v-model="selectedCategories"
              />
              <label class="form-check-label" :for="category">{{
                category
              }}</label>
            </div>
          </div>

          <button @click="applyFilters" class="btn btn-apply">
            Áp dụng bộ lọc
          </button>
          <button @click="resetFilters" class="btn btn-danger w-100 my-3">
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div class="col-12 col-md-8 height-search">
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
      // lọc
      minPrice: null,
      maxPrice: null,
      locations: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ"],
      selectedLocations: [],
      categories: ["Điện tử", "Thời trang", "Gia dụng", "Sách"],
      selectedCategories: [],
      filteredProducts: [],
    };
  },
  async created() {
    await this.searchResult();
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
      selectedCategories: {
        handler() {
          this.applyFilters();
        },
        deep: true,
      },
    },
  },
  methods: {
    async searchResult() {
      const keyWords = this.searchTerm;
      if (keyWords) {
        const response = await searchServices.searchByKeyword(keyWords);

        if (response) {
          const productsWithFavorites = await Promise.all(
            response.data.map(async (product) => {
              const responseFavorite = await this.getFavorite(product._id);
              product.isFavorite = responseFavorite
                ? responseFavorite.IS_FAVORITE
                : false;
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
        this.products.sort((a, b) =>
          a.NAME_PRODUCT.localeCompare(b.NAME_PRODUCT)
        );
      } else if (sortBy === "name-desc") {
        this.products.sort((a, b) =>
          b.NAME_PRODUCT.localeCompare(a.NAME_PRODUCT)
        );
      } else if (sortBy === "price-asc") {
        this.products.sort(
          (a, b) => this.getPrice(a._id) - this.getPrice(b._id)
        );
      } else if (sortBy === "price-desc") {
        this.products.sort(
          (a, b) => this.getPrice(b._id) - this.getPrice(a._id)
        );
      }
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
          this.selectedLocations.includes(product.LOCATION);

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
  min-height: 348px;
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
  color: grey;
  font-size: 25px;
  cursor: pointer;
}
.icon-heart i.active-heart {
  color: red; /* Màu khi trái tim được kích hoạt */
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
  transform: scale(1.03);
  transition: 0.2s ease-in-out;
  cursor: pointer;
}
.background-card {
  background-color: #f9f9f9;

  border-radius: 10px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
}
.height-search {
  min-height: 700px;
}
/* css bộ lọc */
.filter-container {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  font-size: 18px;
  color: #09884d;
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 5px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.price-range input {
  flex: 1;
}

.form-check {
  margin-bottom: 8px;
}

.form-check-label {
  color: #333;
  font-size: 14px;
}

.btn-filter,
.btn-apply {
  background-color: #09884d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-filter:hover,
.btn-apply:hover {
  background-color: #076d3e;
}

.btn-apply {
  width: 100%;
  margin-top: 10px;
}
</style>
