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
          <input class="quantity" type="text" :value="quantity" />
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
import priceServices from "@/services/price.services";
import cartServices from "@/services/cart.services";
import { formatNumber } from "@/utils/formatNumber";
import Swal from "sweetalert2";
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
      quantity: 1,
      priceRange: [],
      priceMin: null,
      priceMax: null,
    };
  },
  computed: {
    payload() {
      return {
        key: Object.keys(this.selectedValues), // Lấy danh sách các key
        value: Object.values(this.selectedValues), // Lấy danh sách các value
        number: this.quantity, // Số lượng sản phẩm
      };
    },
  },
  async created() {
    // setTimeOut để chờ prop đổ dữ liệu xuống
    setTimeout(async () => {
      if (this.product && this.product._id) {
        await this.fetchPrice(this.product._id);
        await this.getPriceRange();
      }
    }, 100);
    console.log("sản phẩm", this.product);
  },
  methods: {
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
      if (this.quantity < this.product.NUMBER_INVENTORY_PRODUCT) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
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
      this.$store.dispatch("addToCart", {
        product: this.product,
        payload: this.payload,
      });
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
      const response = await cartServices.addToCart(
        this.product._id,
        this.payload
      );
      if (response && response.data) {
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
  },
};
</script>

<style scoped>
.value span.selected {
  border: 1px solid #09884d;
  background-color: #e0f7e9;
}
.text-title {
  font-size: 20px;
  font-weight: 450;
}
.price span {
  color: #d0011b;
  font-size: 35px;
  font-weight: 500;
}
.key {
  display: flex;
  align-items: center;
}
.key span,
.number span {
  color: #757575;
  flex-shrink: 0;
  font-size: inherit;
  font-weight: 400;
  margin: 0;
  text-transform: capitalize;
  width: 110px;
}
.key-value,
.number-cart {
  padding: 20px 0;
}
.value {
  display: flex;
  flex-wrap: wrap;
}
.value span.selected {
  border: 1px solid #09884d;
  background-color: #e0f7e9;
}
.value span {
  padding: 10px 24px;
  border: 1px solid #ebebeb;
  margin-left: 7px;
  font-size: 14px;
  margin-bottom: 7px; /* Thêm khoảng cách bên dưới để tránh chồng lên nhau */
}
.value span:hover {
  border: 1px solid #09884d; /* Thay đổi màu viền khi hover */
  transform: scale(1.09);
  transition: 0.2s ease;
  cursor: pointer;
}
.add-cart span {
  border: 1px solid #ebebeb;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
}
.product-available {
  margin: 0;
  align-items: center;
  display: flex;
  padding-left: 40px;
  color: #757575;
  font-size: 14px;
}
.product-not-available {
  margin: 0;
  align-items: center;
  display: flex;
  padding-left: 40px;
  color: red;
  font-size: 14px;
}
.add-to-cart-and-buy {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.add-to-cart-and-buy .add-cart {
  background-color: #09884d;
  color: #ffffff;
  border: none;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 5px;
  margin-right: 10px;
}
.add-to-cart-and-buy .buy {
  background-color: #d3344c;
  color: #fff;
  border: none;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 5px;
}
.add-to-cart-and-buy .add-cart i {
  margin-right: 10px;
}
.quantity {
  width: 40px;
  height: 35px;
  border: 1px solid #ebebeb;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.02);
}
.border-desc {
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
  line-height: 1.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}
</style>
