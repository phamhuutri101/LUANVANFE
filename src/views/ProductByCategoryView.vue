<template>
  <Header />
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 col-md-3 mb-4">
        <h1>Bộ lọc</h1>
        <div class="filter-container">
          <div class="filter-section">
            <div class="filter-section">
              <h3>Danh mục</h3>
              <div
                v-for="category in categories"
                :key="category._id"
                class="form-check"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="category._id"
                  :value="category._id"
                  v-model="selectedCategories"
                />
                <label class="form-check-label" :for="category._id">
                  {{ category.CATEGORY_NAME }}
                </label>
              </div>
            </div>
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
            class="col-3 py-2 card-main"
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
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import favoriteServices from "@/services/favorite.services";
import priceServices from "@/services/price.services";
import typeProductServices from "@/services/typeProduct.services";
import productServices from "@/services/product.services";
import addressServices from "@/services/address.services";
import userServices from "@/services/user.services";
import reviewServices from "@/services/review.services";
import Swal from "sweetalert2";
export default {
  name: "ProductCategoryView",
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
      addressShopProduct: [],
      selectedLocations: [],
      categories: [],
      selectedCategories: [],
      filteredProducts: [],
      productReviews: [],
    };
  },
  async created() {
    await this.searchResult();
    await this.getAddressShop();
  },
  watch: {
    // Từ khóa tìm kiếm
    "$route.query.search": {
      handler(newSearchTerm) {
        this.searchTerm = newSearchTerm;
        this.searchResult();
      },
      immediate: true,
    },
    // Lắng nghe thay đổi của khoảng giá
    minPrice(val) {
      this.applyFilters();
    },
    maxPrice(val) {
      this.applyFilters();
    },
    // Lắng nghe thay đổi của danh mục
    selectedCategories: {
      handler() {
        this.applyFilters();
      },
      deep: true, // Để phát hiện thay đổi bên trong mảng
    },
    // Lắng nghe thay đổi của địa điểm bán
    selectedLocations: {
      handler() {
        this.applyFilters();
      },
      deep: true, // Để phát hiện thay đổi bên trong mảng
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
      const IdType = this.$route.params.id;
      try {
        if (IdType) {
          const response = await typeProductServices.getAllProductByType(
            IdType
          );
          console.log("Dữ liệu trả về từ API:", response.data);
          this.categories = response.data;
          if (response) {
            // Gộp tất cả sản phẩm từ các danh mục
            const allProducts = response.data.flatMap(
              (category) => category.products
            );

            const productsWithFavorites = await Promise.all(
              allProducts.map(async (product) => {
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
                return product;
              })
            );

            this.products = productsWithFavorites || [];
            this.filteredProducts = [...this.products]; // Khởi tạo filteredProducts
            console.log("Dữ liệu lấy sản phẩm:", this.products);
          } else {
            this.products = [];
            this.filteredProducts = [];
          }
          await this.getPriceProduct();
          this.applyFilters(); // Áp dụng bộ lọc sau khi tìm kiếm
        }
      } catch (error) {
        const result = Swal.fire({
          icon: "error",
          title: "Chưa có sản phẩm trong danh mục",
          confirmButtonText: "OK",
        });
        this.$router.push("/");
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
    async getProductByCategory(id) {
      try {
        const response = await productServices.getProductByIdCategory(id);
        if (response && response.data) {
          return response.data;
        } else {
          console.error(`No products found for category ${id}`);
          return [];
        }
      } catch (error) {
        console.error(`Error fetching products for category ${id}:`, error);
        return [];
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
      if (this.selectedCategories.length > 0) {
        const categoryPromises = this.selectedCategories.map(
          async (categoryId) => {
            const products = await this.getProductByCategory(categoryId);
            return Promise.all(
              products.map(async (product) => {
                const responseUserByAccount =
                  await userServices.getUserByAccountId(product.ACCOUNT__ID);
                const responseUserByAddress =
                  await addressServices.getAddressByUserId(
                    responseUserByAccount.data[0].user._id
                  );
                product.addressShop = responseUserByAddress.data[0].PROVINCE;
                return product;
              })
            );
          }
        );

        Promise.all(categoryPromises)
          .then((responses) => {
            let productsByCategories = [];
            responses.forEach((response) => {
              if (response) {
                productsByCategories = [...productsByCategories, ...response];
              }
            });

            this.filteredProducts =
              productsByCategories.length > 0
                ? [...new Set(productsByCategories)] // Loại bỏ sản phẩm trùng lặp
                : [];

            // Áp dụng tiếp các bộ lọc giá và địa điểm
            this.applyPriceAndLocationFilters();
          })
          .catch((error) => {
            console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
          });
      } else {
        // Nếu không có danh mục, chỉ lọc theo giá và nơi bán
        this.filteredProducts = [...this.products];
        this.applyPriceAndLocationFilters();
      }
    },

    resetFilters() {
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedLocations = [];
      this.selectedCategories = [];
      this.filteredProducts = [...this.products];
    },
    applyPriceAndLocationFilters() {
      this.filteredProducts = this.filteredProducts.filter((product) => {
        const price = this.getPrice(product._id);
        const priceMatch =
          (this.minPrice === null || price >= this.minPrice) &&
          (this.maxPrice === null || price <= this.maxPrice);

        const locationMatch =
          this.selectedLocations.length === 0 ||
          this.selectedLocations.includes(product.addressShop);

        return priceMatch && locationMatch;
      });
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
  width: 223px;
  min-height: 348px;
}
.card-product-img {
  width: 222px;
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
