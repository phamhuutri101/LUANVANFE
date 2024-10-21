<template>
  <div class="shopee-checkout">
    <!-- Header -->
    <header class="shopee-header">
      <div
        class="container d-flex justify-content-between align-items-center py-2"
      >
        <img src="/path-to-shopee-logo.png" alt="Shopee" height="40" />
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
              src="/path-to-product-image.jpg"
              alt="Hinh ảnh"
              width="60"
              height="60"
              class="me-2 rounded"
            />
            <div>
              <p class="m-0 product-name">
                {{ item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT }}
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

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span>Đơn vị vận chuyển:</span>
          <div>
            <span class="text-success me-2">Nhanh</span>
            <a href="#" class="shopee-link small">Thay đổi</a>
          </div>
        </div>
        <p class="text-muted small mt-1">Nhận hàng vào 12 Th10 - 14 Th10</p>
        <div class="d-flex justify-content-between align-items-center">
          <span>Được đồng kiểm</span>
          <i class="bi bi-question-circle text-muted"></i>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <span class="text-muted me-2"
            >Tổng số tiền ({{ calculateTotalNumber() }} sản phẩm):</span
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
          <span>0đ</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Tổng thanh toán:</span>
          <span class="text-shopee fw-bold fs-5">{{
            formatPriceCart(calculateTotalPrice())
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
      return this.cart.reduce((total, item) => {
        return total + item.ITEM.PRICE * item.ITEM.QUANTITY; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
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
        await orderServices.addOrder(this.defaultAddress);
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
      } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
      }
    },
    calculateTotalNumber() {
      return this.cart.reduce((total, item) => {
        return total + item.ITEM.QUANTITY;
      }, 0);
    },
    formatPriceCart(price) {
      return formatNumber(price);
    },
  },
};
</script>

<style scoped>
.selected-payment {
  border-color: #ee4d2d;
  color: #ee4d2d;
}
.text-default-address {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.change-address {
  position: absolute;
  right: 0;
}
.modal-body {
  display: flex;
  align-items: center;
}
.modal-body label {
  padding-left: 10px;
}
.default-address {
  padding: 5px;
  border: 1px solid #44ba69;
  color: #44ba69;
}
.shopee-checkout {
  background-color: #f5f5f5;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.shopee-header {
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
}

.checkout-title {
  color: #ee4d2d;
  font-size: 1.25rem;
  font-weight: 500;
}

.shopee-card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 0.75rem;
  padding: 1rem;
}

.text-shopee {
  color: #ee4d2d;
}

.shopee-link button {
  color: #05a;
  text-decoration: none;
  border: none;
  background: none;
}

.shopee-link button:hover {
  color: #ee4d2d;
}

.product-name {
  font-size: 0.875rem;
  line-height: 1.2;
}

.badge {
  font-weight: 400;
  padding: 0.25em 0.5em;
}

.bg-shopee {
  background-color: #ee4d2d;
  color: #fff;
}

.btn-payment {
  background-color: #fff;
  border: 1px solid #d0d0d0;
  color: #222;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.btn-shopeepay {
  border-color: #ee4d2d;
  color: #ee4d2d;
}

.btn-shopee {
  background-color: #ee4d2d;
  border-color: #ee4d2d;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
}

.btn-shopee:hover {
  background-color: #d73211;
  border-color: #d73211;
}

.shopee-footer {
  background-color: #fbfbfb;
  font-size: 0.75rem;
}

.footer-heading {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.footer-link {
  color: rgba(0, 0, 0, 0.65);
  display: inline-block;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.footer-link:hover {
  color: #ee4d2d;
}
</style>
