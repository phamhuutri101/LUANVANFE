<template>
  <div class="col-7 rounded-1 p-3">
    <div class="text-title">
      <p>
        {{ product.NAME_PRODUCT }}
      </p>
    </div>
    <div class="price">
      <span>{{ formatNumber(price) }}</span>
    </div>
    <div
      v-for="(key, keyIndex) in product.LIST_PRODUCT_METADATA"
      :key="keyIndex"
      class="row key-value"
    >
      <div class="col-2 key">
        <span>{{ key.KEY }}</span>
      </div>
      <div class="col-10 d-flex">
        <div
          class="value"
          v-for="(value, valueIndex) in key.VALUE"
          :key="valueIndex"
          @click="selectValue(key.KEY, value)"
        >
          <span :class="{ selected: isSelected(key.KEY, value) }">
            {{ value }}
          </span>
        </div>
      </div>
    </div>

    <div class="row number-cart">
      <div class="col-2 number">
        <span> Số lượng</span>
      </div>
      <div class="col-10">
        <div class="add-cart d-flex">
          <span @click="decreaseQuantity">-</span>
          <input
            class="quantity"
            type="text"
            :value="payload.number"
            @input="validateInput"
          />
          <span @click="increaseQuantity">+</span>
          <p
            v-if="product.NUMBER_INVENTORY_PRODUCT > 0"
            class="product-available"
          >
            {{ product.NUMBER_INVENTORY_PRODUCT }} sản phẩm có sẵn
          </p>
          <p v-else class="product-not-available">Sản phẩm hết hàng</p>
        </div>
      </div>
    </div>
    <div class="add-to-cart-and-buy">
      <button @click="addToCart" type="submit" class="add-cart">
        <i class="fa-solid fa-cart-shopping"></i>Thêm Vào Giỏ Hàng
      </button>
    </div>
  </div>
  <div class="col-12 shop-section">
    <div class="shop-info">
      <div class="shop-details">
        <div>
          <span class="shop-name">{{ nameShop }}</span>
          <a @click="gotoDetailShop(product.ACCOUNT__ID)" class="view-shop"
            >Xem Shop</a
          >
        </div>
      </div>
      <div class="shop-stats">
        <div class="stat-item">
          <span class="stat-label">Đánh giá</span>
          <span class="stat-value highlight">{{ totalRatingShop }} sao</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Sản phẩm</span>
          <span class="stat-value">{{ totalProductShop }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12">
    <h2 class="title">Mô tả sản phẩm</h2>
    <div class="border-desc">
      <p>{{ product.SHORT_DESC }}</p>
    </div>
  </div>
  <div class="col-12">
    <h2 class="title">Mô tả chi tiết</h2>
    <div class="border-desc">
      <p>{{ product.DESC_PRODUCT }}</p>
    </div>
  </div>
</template>

<script>
import isTokenValid from "@/utils/isTokenValid";
import getCookie from "@/utils/getCookie";
import priceServices from "@/services/price.services";
import cartServices from "@/services/cart.services";

import { formatNumber } from "@/utils/formatNumber";
import Swal from "sweetalert2";
import userServices from "@/services/user.services";
import productServices from "@/services/product.services";
import reviewServices from "@/services/review.services";
import shopServices from "@/services/shop.services";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      price: null,
      payload: {
        key: [],
        value: [],
        number: 1,
      },
      dataUser: {},
      totalProductShop: "",
      totalRatingShop: "",
      nameShop: "",
      priceRange: [],
      priceMin: null,
      priceMax: null,
    };
  },

  computed: {
    computedPayload() {
      return {
        key: Object.keys(this.selectedValues), // Lấy danh sách các key
        value: Object.values(this.selectedValues), // Lấy danh sách các value
      };
    },
  },
  async created() {
    // setTimeOut để chờ prop đổ dữ liệu xuống
    setTimeout(async () => {
      if (this.product && this.product._id) {
        await this.fetchPrice(this.product._id);
        await this.getPriceRange();
        await this.getUserByAccountId();
        await this.getTotalNumberShop();
        await this.getTotalRatingShop();
        await this.getNameShopByAccountId();
      }
    }, 300);
  },
  methods: {
    async getNameShopByAccountId() {
      const response = await shopServices.getNameShopByAccountId(
        this.product.ACCOUNT__ID
      );
      if (response && response.data) {
        this.nameShop = response.data;
      }
    },
    async getUserByAccountId() {
      const response = await userServices.getUserByAccountId(
        this.product.ACCOUNT__ID
      );
      if (response && response.data) {
        this.dataUser = response.data[0];
      }
    },
    async getTotalNumberShop() {
      const response = await productServices.getTotalProductShop(
        this.product.ACCOUNT__ID
      );
      if (response && response.data) {
        this.totalProductShop = response.data;
      }
    },
    async getTotalRatingShop() {
      const response = await reviewServices.getTotalReviewsShop(
        this.dataUser.user._id
      );
      if (response && response.data) {
        this.totalRatingShop = response.data;
      }
    },
    async fetchPrice(id) {
      try {
        const response = await priceServices.getDefaultPrice(id);
        console.log("API response:", response);
        if (response) {
          this.price = response.data[0].PRICE_NUMBER;
        } else {
          this.price = "Không có giá";
        }
      } catch (error) {
        console.error("Lỗi khi lấy giá:", error);
        this.price = "Lỗi khi lấy giá";
      }
    },
    increaseQuantity() {
      if (this.payload.number < this.product.NUMBER_INVENTORY_PRODUCT) {
        this.payload.number++;
      }
    },
    decreaseQuantity() {
      if (this.payload.number > 1) this.payload.number--;
    },
    selectValue(key, value) {
      const keyIndex = this.payload.key.indexOf(key);

      if (keyIndex !== -1) {
        // Nếu key đã tồn tại trong mảng, cập nhật giá trị tương ứng
        this.payload.value[keyIndex] = value;
      } else {
        // Nếu key chưa tồn tại, thêm mới cả key và value
        this.payload.key.push(key);
        this.payload.value.push(value);
      }
      this.getPriceKV();
      this.checkQuantity();
    },
    isSelected(key, value) {
      const keyIndex = this.payload.key.indexOf(key);
      return keyIndex !== -1 && this.payload.value[keyIndex] === value;
    },
    async addToCart() {
      try {
        if (this.quantity > this.product.NUMBER_INVENTORY_PRODUCT) {
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
            icon: "error",
            title: "số lượng sản phẩm trong kho không đủ",
          });
          return; // Ngừng xử lý nếu số lượng không đủ
        }
        const cartResponse = await cartServices.getAllCart();
        if (cartResponse && cartResponse.data) {
          const cartItems = cartResponse.data;

          // Tính tổng số lượng sản phẩm trong giỏ hàng có cùng ID_PRODUCT và LIST_MATCH_KEY
          const totalInCart = cartItems
            .filter(
              (item) =>
                item.ITEM.ID_PRODUCT === this.product._id &&
                this.isMatchingKeys(item.ITEM.LIST_MATCH_KEY)
            )
            .reduce((sum, item) => sum + item.ITEM.QUANTITY, 0);

          // Kiểm tra tổng số lượng (trong giỏ + muốn thêm) so với tồn kho
          if (
            totalInCart + this.payload.number >
            this.product.NUMBER_INVENTORY_PRODUCT
          ) {
            Swal.fire({
              icon: "error",
              title: "Số lượng sản phẩm trong kho không đủ",
            });
            return;
          }
        }
        if (this.payload.key.length === 0 || this.payload.value.length === 0) {
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
            icon: "error",
            title: "Bạn vẫn chưa chọn phân loại sản phẩm",
          });
          return; // Ngừng xử lý nếu chưa chọn biến thể
        }

        const token = getCookie("access_token");
        if (isTokenValid(token)) {
          const response = await cartServices.addToCart(
            this.product._id,
            this.payload
          );

          if (response && response.data) {
            const updatedCart = await cartServices.getAllCart(); // Lấy giỏ hàng mới từ server
            if (updatedCart && updatedCart.data) {
              const totalItems = updatedCart.data.length;
              this.$store.commit("setCartItemCount", totalItems); // Cập nhật số lượng
              await this.$store.dispatch("fetchCartItemCount"); // Cập nhật số lượng sản phẩm trong giỏ hàng
            }
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 800,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: "Thêm sản phẩm vào giỏ hàng thành công",
            });
          } else {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "error",
              title: "Bạn vẫn chưa chọn phân loại sản phẩm",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Bạn cần đăng nhập để mua hàng",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPriceKV() {
      try {
        const response = await priceServices.getPriceKeyValue(
          this.product._id,
          this.payload
        );
        if (response && response.data) {
          this.price = response.data[0].PRICE_NUMBER;
        }
      } catch (error) {
        console.error("Lỗi khi lấy giá:", error);
        Swal.fire({
          title: "Sản phẩm chưa thêm giá ",
        });
      }
    },
    async getPriceRange() {
      if (this.product && this.product._id) {
        const priceRange = await priceServices.getPriceRange(this.product._id);
        if (priceRange && priceRange.data) {
          this.priceRange = priceRange.data;
          this.priceMin = Math.min(
            ...this.priceRange.map((priceMin) => priceMin.PRICE_NUMBER)
          );
          this.priceMax = Math.max(
            ...this.priceRange.map((price) => price.PRICE_NUMBER)
          );
          this.price = `${this.priceMin.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })} - ${this.priceMax.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`;
        } else {
          console.error("Dữ liệu product hoặc product._id chưa sẵn sàng");
        }
      }
    },
    checkQuantity() {
      const selectedKeys = this.payload.key;
      const selectedValues = this.payload.value;

      // Tìm sản phẩm có danh sách thuộc tính khớp với lựa chọn
      const matchedProduct = this.product.QUANTITY_BY_KEY_VALUE.find(
        (product) => {
          return product.LIST_MATCH_KEY.every((matchKey) => {
            const keyIndex = selectedKeys.indexOf(matchKey.KEY);
            return (
              keyIndex !== -1 && selectedValues[keyIndex] === matchKey.VALUE[0]
            );
          });
        }
      );

      if (matchedProduct) {
        // Nếu tìm thấy sản phẩm khớp, cập nhật số lượng
        this.product.NUMBER_INVENTORY_PRODUCT = matchedProduct.QUANTITY;
      } else {
        // Nếu không tìm thấy sản phẩm khớp, đặt số lượng về 0
        this.product.NUMBER_INVENTORY_PRODUCT = 0;
      }
    },
    formatNumber(price) {
      if (price) {
        return formatNumber(price);
      }
    },
    gotoDetailShop(id_account) {
      this.$router.push({ name: "ShopDetail", params: { id: id_account } });
    },
    isMatchingKeys(cartKeys) {
      // So sánh LIST_MATCH_KEY của sản phẩm trong giỏ với payload
      if (!cartKeys || cartKeys.length !== this.payload.key.length)
        return false;

      return cartKeys.every((cartKey) => {
        const index = this.payload.key.indexOf(cartKey.KEY);
        return index !== -1 && this.payload.value[index] === cartKey.VALUE;
      });
    },
    validateInput(event) {
      const value = event.target.value;
      const validValue = value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
      this.payload.number = validValue ? parseInt(validValue, 10) : 1; // Cập nhật giá trị, đảm bảo ít nhất là 1
      event.target.value = this.payload.number; // Cập nhật lại giá trị hiển thị
    },
  },
};
</script>

<style scoped>
.shop-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.shop-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.shop-info {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-radius: 8px;
}

.shop-details {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  border-right: 1px solid #f0f0f0;
}

.shop-name {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  transition: color 0.3s ease;
}

.shop-name:hover {
  color: #09884d;
}

.view-shop {
  display: inline-block;
  padding: 8px 20px;
  background: #fff;
  border: 1.5px solid #09884d;
  border-radius: 6px;
  color: #09884d;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.view-shop:hover {
  background: #09884d;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(9, 136, 77, 0.15);
}

.shop-stats {
  display: flex;
  gap: 32px;
  padding: 16px 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.stat-value.highlight {
  color: #09884d;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shop-section {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .shop-info {
    flex-direction: column;
    gap: 16px;
  }

  .shop-details {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
  }

  .shop-stats {
    padding-top: 16px;
  }
}
.text-title {
  font-size: 24px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.text-title:hover {
  color: #09884d;
}

.price {
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.price span {
  color: #d0011b;
  font-size: 35px;
  font-weight: 600;
  display: inline-block;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
}

.key {
  display: flex;
  align-items: center;
}

.key span,
.number span {
  color: #666;
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;
  width: 110px;
  transition: color 0.3s ease;
}

.key-value,
.number-cart {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.value {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.value span {
  padding: 10px 24px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  border-radius: 6px;
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.value span.selected {
  border: 2px solid #09884d;
  background-color: #e0f7e9;
  font-weight: 500;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(9, 136, 77, 0.15);
}

.value span:hover {
  border-color: #09884d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-cart {
  display: flex;
  align-items: center;
  gap: 15px;
}

.add-cart span {
  border: 1px solid #e0e0e0;
  padding: 8px 18px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  background: #f8f9fa;
}

.add-cart span:hover {
  background: #09884d;
  color: white;
  border-color: #09884d;
}

.quantity {
  width: 50px;
  height: 38px;
  border: 1px solid #e0e0e0;
  text-align: center;
  font-size: 16px;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s ease;
}

.quantity:focus {
  border-color: #09884d;
  box-shadow: 0 0 0 3px rgba(9, 136, 77, 0.1);
}

.product-available {
  margin: 0;
  align-items: center;
  display: flex;
  padding-left: 40px;
  color: #09884d;
  font-size: 14px;
  font-weight: 500;
}

.product-not-available {
  margin: 0;
  align-items: center;
  display: flex;
  padding-left: 40px;
  color: #d0011b;
  font-size: 14px;
  font-weight: 500;
}

.add-to-cart-and-buy {
  display: flex;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.add-to-cart-and-buy .add-cart {
  background-color: #09884d;
  color: #ffffff;
  border: none;
  padding: 12px 35px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-right: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(9, 136, 77, 0.2);
}

.add-to-cart-and-buy .add-cart:hover {
  background-color: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.3);
}

.add-to-cart-and-buy .add-cart:active {
  transform: translateY(0);
}

.add-to-cart-and-buy .add-cart i {
  font-size: 18px;
}

.add-to-cart-and-buy .buy {
  background-color: #d3344c;
  color: #fff;
  border: none;
  padding: 12px 35px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(211, 52, 76, 0.2);
}

.add-to-cart-and-buy .buy:hover {
  background-color: #b32b40;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 52, 76, 0.3);
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin: 30px 0 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  border-left: 4px solid #09884d;
  transition: all 0.3s ease;
}

.title:hover {
  background: #f0f2f5;
  transform: translateX(5px);
}

.border-desc {
  color: #4a4a4a;
  font-size: 15px;
  line-height: 1.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.border-desc:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Thêm animation cho các thay đổi số lượng */
@keyframes quantityChange {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.quantity:focus {
  animation: quantityChange 0.3s ease;
}

/* Hiệu ứng loading cho giá khi đang tải */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.price.loading span {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent;
}
</style>
