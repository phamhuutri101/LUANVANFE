<template>
  <div class="col-md-9 background-component p-4">
    <ul
      class="nav nav-pills mb-3 d-flex justify-content-between"
      id="pills-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="AllOrder-tab"
          data-bs-toggle="pill"
          data-bs-target="#AllOrder"
          type="button"
          role="tab"
          aria-controls="AllOrder"
          aria-selected="true"
        >
          Tất cả
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
        >
          Chờ thanh toán
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-contact"
          type="button"
          role="tab"
          aria-controls="pills-contact"
          aria-selected="false"
        >
          Vận chuyển
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="success-order-tab"
          data-bs-toggle="pill"
          data-bs-target="#success-order"
          type="button"
          role="tab"
          aria-controls="success-order"
          aria-selected="false"
        >
          Hoàn thành
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-contact"
          type="button"
          role="tab"
          aria-controls="pills-contact"
          aria-selected="false"
        >
          Đã hủy
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="AllOrder"
        role="tabpanel"
        aria-labelledby="AllOrder-tab"
      >
        <div class="wrap" v-for="item in order" :key="item._id">
          <div class="title-order d-flex py-4 border-bottom">
            <span>Tên shop</span>
            <span class="show-shop"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  src="https://anhvienpiano.com/wp-content/uploads/2018/07/chup-anh-san-pham-dep.jpg"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-4">
              <span>Thành tiền</span>
              <span>{{ formatNumber(calculateTotalPrice(item)) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button>Đã nhận hàng</button>
                <button>Xác nhận hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        2
      </div>
      <div
        class="tab-pane fade"
        id="pills-contact"
        role="tabpanel"
        aria-labelledby="pills-contact-tab"
      >
        3
      </div>
      <div
        class="tab-pane fade"
        id="success-order"
        role="tabpanel"
        aria-labelledby="success-order-tab"
      >
        <div class="wrap" v-for="item in orderSuccess" :key="item._id">
          <div class="title-order d-flex py-4 border-bottom">
            <span>Tên shop</span>
            <span class="show-shop"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  src="https://anhvienpiano.com/wp-content/uploads/2018/07/chup-anh-san-pham-dep.jpg"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-4">
              <span>Thành tiền</span>
              <span>{{ formatNumber(calculateTotalPrice(item)) }}</span>
            </div>
            <div class="notification d-flex justify-content-between">
              <span
                >Đơn hàng đã hoàn thành vui lòng cho biết cảm nhận sản phẩm bằng
                cách đánh giá sản phẩm</span
              >
              <div class="confirm d-flex">
                <button>Đánh giá</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import { formatNumber } from "@/utils/formatNumber";
export default {
  data() {
    return {
      order: [],
      orderSuccess: [],
    };
  },
  created() {
    this.getOrder();
    this.getOrderSuccess();
  },
  methods: {
    async getOrder() {
      const order = await orderServices.getOrderUser();
      // Sau khi lấy danh sách đơn hàng, gọi API để lấy tên sản phẩm
      for (const item of order.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.order = order.data;
    },
    async getOrderSuccess() {
      const orderSuccess = await orderServices.getSuccessPaymentOrder();
      for (const item of orderSuccess.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.orderSuccess = orderSuccess.data;
    },
    async getNameProduct(id) {
      const response = await productServices.getById(id);
      console.log(response.data.NAME_PRODUCT);
      return response.data.NAME_PRODUCT;
    },
    calculateTotalPrice(order) {
      return order.LIST_PRODUCT.reduce((total, item) => {
        return total + item.UNITPRICES * item.QLT; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
    },
    formatNumber(number) {
      return formatNumber(number);
    },
  },
};
</script>

<style scoped>
.img img {
  background: #e1e1e1;
  border: 1px solid #e1e1e1;
  flex-shrink: 0;
  height: 80px;
  width: 80px;
}
.name span {
  font-size: 16px;
  line-height: 12px;
}
.name .classify {
  color: rgba(0, 0, 0, 0.54);
}
.title-order span {
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  margin-right: 8px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  display: flex;
}

.show-shop {
  border: 1px solid rgba(0, 0, 0, 0.09);
  color: #555;
  padding: 5px;
}
.notification span {
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.confirm {
  padding-left: 100px;
}
.confirm button:nth-child(1) {
  background-color: #4caf50;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 10px;
  cursor: pointer;
  width: 192px;
  padding: 0 30px;
  height: 40px;
}
.confirm button:nth-child(2) {
  background-color: #f44336;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 10px;
  cursor: pointer;
  width: 192px;
  padding: 0 30px;
  height: 40px;
}
.total-price span:nth-child(2) {
  color: #44ba69;
  font-size: 24px;
  line-height: 30px;
}
.total-price span:nth-child(1) {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  line-height: 20px;
  margin: 0 10px 0 0;
}
.nav-pills .nav-link.active {
  background-color: #44ba69;
  color: #fff;
}
.nav-pills .nav-link {
  color: #000;
}
</style>
