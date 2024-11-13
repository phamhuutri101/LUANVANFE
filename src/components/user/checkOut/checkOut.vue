<template>
  <div class="shopee-checkout">
    <!-- Header -->
    <header class="shopee-header">
      <div
        class="container d-flex justify-content-between align-items-center py-2"
      >
        <span class="checkout-title">Thanh Toán</span>
      </div>
    </header>

    <!-- Main content -->
    <div class="container my-4">
      <!-- Shipping address -->
      <div class="shopee-card address-card">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-geo-alt text-shopee me-2"></i>
          <h5 class="m-0">Địa Chỉ Nhận Hàng</h5>
        </div>
        <div class="d-flex position-relative">
          <p class="m-0 text-default-address" v-if="defaultAddress">
            {{
              defaultAddress.DESC +
              " " +
              defaultAddress.COMMUNE +
              " " +
              defaultAddress.DISTRICT +
              " " +
              defaultAddress.PROVINCE
            }}
          </p>

          <p v-else class="m-0">Địa chỉ mặc đinh chưa được thiết lập</p>
          <span
            v-if="defaultAddress.IS_DEFAULT == true"
            class="px-2 default-address"
          >
            (mặc định)</span
          >
          <a href="#" class="shopee-link change-address small">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Thay đổi
            </button></a
          >
        </div>
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Địa chỉ của tôi
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" v-for="item in address" :key="item._id">
              <input
                type="radio"
                :id="item._id"
                name="fav_address"
                :value="item"
                v-model="selectedAddress"
              />
              <label :for="item._id"
                >{{
                  item.DESC +
                  " " +
                  item.COMMUNE +
                  " " +
                  item.DISTRICT +
                  " " +
                  item.PROVINCE
                }}
                <span v-if="item.IS_DEFAULT === true" class="default-address"
                  >Mặc đinh</span
                ></label
              ><br />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                @click="updateDefaultAddress"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Products -->
      <div class="shopee-card product-card">
        <div>
          <div class="row">
            <div class="col-3">
              <h5 class="mb-3">Sản phẩm</h5>
            </div>
            <div class="col-3 text-end">
              <span class="px-1">Đơn giá</span>
            </div>
            <div class="col-3 text-end">
              <span>Số lượng</span>
            </div>
            <div class="col-3 text-end">
              <span>Thành tiền</span>
            </div>
          </div>
        </div>
        <div class="row" v-for="item in cart" :key="item._id">
          <div class="col-3 d-flex justify-content-between align-items-center">
            <img
              :src="
                item.ITEM.PRODUCT_DETAILS.LIST_FILE_ATTACHMENT_DEFAULT[0]
                  .FILE_URL
              "
              alt="Hinh ảnh"
              width="60"
              height="60"
              class="me-2 rounded"
            />
            <div>
              <p class="m-0 product-name">
                {{ trumCatName(item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT) }}
              </p>
            </div>
          </div>
          <div class="col-3 text-end">
            <span>{{ formatPriceCart(item.ITEM.PRICE) }}</span>
          </div>
          <div class="col-3 text-end">
            <span class="px-4">{{ item.ITEM.QUANTITY }}</span>
          </div>
          <div class="col-3 text-end">
            <span class="text-shopee fw-bold">
              {{
                formatPriceCart(
                  totalPriceCart(item.ITEM.PRICE, item.ITEM.QUANTITY)
                )
              }}</span
            >
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <span class="text-muted me-2"
            >Tổng số tiền ({{ totalNumber() }} sản phẩm):</span
          >
          <span class="text-shopee fw-bold">{{
            formatPriceCart(calculateTotalPrice())
          }}</span>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="shopee-card payment-card">
        <h5 class="mb-3">Phương thức thanh toán</h5>
        <div class="d-flex flex-wrap">
          <button
            class="btn btn-payment me-2 mb-2"
            @click="selectPaymentMethod('ZaloPay')"
            :class="{ 'selected-payment': selectedPaymentMethod === 'ZaloPay' }"
          >
            ZaloPay
          </button>
          <button
            class="btn btn-payment me-2 mb-2"
            @click="selectPaymentMethod('MoMo')"
            :class="{ 'selected-payment': selectedPaymentMethod === 'MoMo' }"
          >
            MoMo
          </button>
          <button
            class="btn btn-payment mb-2"
            @click="selectPaymentMethod('COD')"
            :class="{ 'selected-payment': selectedPaymentMethod === 'COD' }"
          >
            Thanh toán khi nhận hàng
          </button>
        </div>
      </div>

      <!-- Order summary -->
      <div class="shopee-card summary-card">
        <div class="d-flex justify-content-between mb-2">
          <span>Tổng tiền hàng</span>
          <span>{{ formatPriceCart(calculateTotalPrice()) }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Phí vận chuyển</span>
          <span>{{ formatPriceCart(shipping()) }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Giảm giá</span>
          <span>{{ formatPriceCart(reduce()) }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Tổng thanh toán:</span>
          <span class="text-shopee fw-bold fs-5">{{
            formatPriceCart(totalPayment())
          }}</span>
        </div>
        <p class="text-muted small">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
          <a href="#" class="shopee-link">Điều khoản Shopee</a>
        </p>
        <button class="btn btn-shopee w-100" @click="placeOrder">
          Đặt hàng
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="shopee-footer mt-4 pt-4 pb-2">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <h6 class="footer-heading">CHĂM SÓC KHÁCH HÀNG</h6>
            <ul class="list-unstyled">
              <li><a href="#" class="footer-link">Trung Tâm Trợ Giúp</a></li>
              <li><a href="#" class="footer-link">Shopee Blog</a></li>
              <li><a href="#" class="footer-link">Shopee Mall</a></li>
              <!-- More items... -->
            </ul>
          </div>
          <!-- More columns... -->
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="text-muted small">
              © 2024 Shopee. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import cartServices from "@/services/cart.services";
import { formatNumber } from "@/utils/formatNumber";
import addressServices from "@/services/address.services";
import PaymentService from "@/services/payment.services";
import orderServices from "@/services/order.services";
import emailServices from "@/services/email.services";
import userServices from "@/services/user.services";
import trumCatName from "@/utils/trumCatName";
export default {
  data() {
    return {
      cart: [],
      address: [],
      defaultAddress: {},
      selectedAddress: null,
      selectedPaymentMethod: null,
    };
  },
  async created() {
    await this.getCart();
    await this.getAddress();
    await this.getDefaultAddress();
  },
  methods: {
    async getCart() {
      const response = await cartServices.getCart();
      if (response && response.data.length > 0) {
        this.cart = response.data;
      } else {
        console.error("không có sản phẩm nào trong giỏ hàng");
      }
    },
    async getAddress() {
      const response = await addressServices.getAddress();
      if (response && response.data.length > 0) {
        this.address = response.data;
      } else {
        console.error("Không có địa chỉ nào trong danh sách");
      }
    },
    onOrderClick() {
      this.$router.push({
        name: "information",
        query: { component: "order" },
      });
    },
    async getDefaultAddress() {
      const response = await addressServices.getDefaultAddress();
      if (response && response.data.length > 0) {
        this.defaultAddress = response.data[0].LIST_ADDRESS_USER;
      }
    },
    updateDefaultAddress() {
      if (this.selectedAddress) {
        this.defaultAddress = this.selectedAddress;
        console.log("địa chỉ chọn", this.selectedAddress);
      }
    },
    calculateTotalPrice() {
      return Number(sessionStorage.getItem("totalNumberPrice"));
    },
    totalPriceCart(price, quantity) {
      let total = 0;

      total += price * quantity;

      return total;
    },
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
    },
    async sendEmailOrder() {
      try {
        const UserLogin = await userServices.getUserLogin();
        console.log("User đăng nhập:", UserLogin);
        const userById = await userServices.getUserById(UserLogin.data.USER_ID);
        console.log("User theo ID:", userById);

        await emailServices.sendMailOrder({ email: userById.data.EMAIL_USER });
      } catch (error) {
        console.error(error);
      }
    },
    async placeOrder() {
      if (!this.selectedPaymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }

      try {
        await orderServices.addOrder({
          PROVINCE: this.defaultAddress.PROVINCE,
          DISTRICT: this.defaultAddress.DISTRICT,
          COMMUNE: this.defaultAddress.COMMUNE,
          DESC: this.defaultAddress.DESC,
          PRICE: this.totalPayment(), // Tổng tiền của giỏ hàng
          DISCOUNT: this.reduce(), // Mã giảm giá
          SHIPPING: this.shipping(), // Phí ship
        });
        await this.sendEmailOrder();
        let paymentResponse;
        switch (this.selectedPaymentMethod) {
          case "ZaloPay":
            paymentResponse = await PaymentService.paymentZaloPay();
            break;
          case "MoMo":
            paymentResponse = await PaymentService.paymentMOMO();
            break;
          case "COD":
            paymentResponse = await PaymentService.paymentCOD();
            break;
          default:
            alert("Phương thức thanh toán không hợp lệ");
            return;
        }
        if (paymentResponse.payUrl) {
          window.location.href = paymentResponse.payUrl;
        } else if (paymentResponse.order_url) {
          window.location.href = paymentResponse.order_url;
        } else {
          console.error("Không nhận được URL thanh toán hợp lệ.");
        }
        if (this.selectedPaymentMethod === "COD") {
          this.onOrderClick();
        }
        sessionStorage.removeItem("priceReduce");
        sessionStorage.removeItem("priceTotalCart");
        sessionStorage.removeItem("shipping");
        sessionStorage.removeItem("totalNumberPrice");
        sessionStorage.removeItem("totalNumberProduct");
      } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
      }
    },
    totalNumber() {
      return Number(sessionStorage.getItem("totalNumberProduct"));
    },
    reduce() {
      return Number(sessionStorage.getItem("priceReduce"));
    },
    shipping() {
      return Number(sessionStorage.getItem("shipping"));
    },
    totalPayment() {
      return Number(sessionStorage.getItem("priceTotalCart"));
    },
    formatPriceCart(price) {
      return formatNumber(price);
    },
    trumCatName(name) {
      return trumCatName(name);
    },
  },
};
</script>

<style scoped>
.shopee-checkout {
  background-color: #f8f9fa;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

.shopee-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.checkout-title {
  color: #09884d;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  padding-left: 15px;
}

.checkout-title::before {
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

.shopee-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.shopee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Address Card Styles */
.address-card {
  border-left: 4px solid #09884d;
}

.text-default-address {
  display: flex;
  align-items: center;
  padding-right: 10px;
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.6;
}

.change-address {
  position: absolute;
  right: 0;
}

.change-address button {
  color: #09884d;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.change-address button:hover {
  background-color: #e0f7e9;
  color: #076d3d;
}

/* Modal Styles */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
  border-bottom: 2px solid #eef0f2;
}

.modal-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal-body {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  transition: all 0.3s ease;
}

.modal-body:hover {
  background: #f8f9fa;
}

.modal-body input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #09884d;
}

.modal-body label {
  padding-left: 15px;
  color: #2c3e50;
  font-size: 15px;
  cursor: pointer;
}

.default-address {
  padding: 4px 8px;
  border: 1px solid #09884d;
  color: #09884d;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
  background: #e0f7e9;
}

/* Product Card Styles */
.product-card {
  background: #ffffff;
}

.product-card img {
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.product-card img:hover {
  transform: scale(1.05);
}

.product-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.4;
}

/* Payment Methods */
.btn-payment {
  background-color: #ffffff;
  border: 2px solid #eef0f2;
  color: #2c3e50;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-payment:hover {
  border-color: #09884d;
  color: #09884d;
  transform: translateY(-2px);
}

.selected-payment {
  border-color: #09884d;
  color: #09884d;
  background: #e0f7e9;
  box-shadow: 0 2px 8px rgba(9, 136, 77, 0.15);
}

/* Order Summary */
.summary-card {
  border-top: 4px solid #09884d;
}

.text-shopee {
  color: #09884d;
}

.btn-shopee {
  background-color: #09884d;
  border: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(9, 136, 77, 0.2);
}

.btn-shopee:hover {
  background-color: #076d3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 136, 77, 0.3);
}

.btn-shopee:active {
  transform: translateY(0);
}

/* Footer Styles */
.shopee-footer {
  background-color: #ffffff;
  border-top: 1px solid #eef0f2;
  padding-top: 40px;
}

.footer-heading {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
}

.footer-link {
  color: #666;
  display: inline-block;
  margin-bottom: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.footer-link:hover {
  color: #09884d;
  transform: translateX(5px);
}

/* Additional Animations */
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

.shopee-card {
  animation: fadeIn 0.5s ease;
}

/* Loading States */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .shopee-card {
    padding: 1rem;
  }

  .btn-payment {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
