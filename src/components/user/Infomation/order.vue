<template>
  <div class="col-md-9 background-component background-height p-4">
    <!-- modal đánh giá sp -->
    <div
      class="modal modal-lg fade"
      id="ratingModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ratingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title text-title fs-5" id="ratingModalLabel">
              Đánh Giá Sản Phẩm
            </h1>
          </div>
          <div
            class="modal-body"
            v-if="orderDataRating"
            v-for="item in orderDataRating.LIST_PRODUCT"
            :key="item._id"
          >
            <div class="card">
              <div class="card-body">
                <p>{{ item.NAME_PRODUCT }}</p>
                <div class="d-flex">
                  <p class="classify">Phân loại hàng:</p>
                  <p
                    class="px-1 classify"
                    v-for="classify in item.LIST_MATCH_KEY"
                    :key="classify._id"
                  >
                    {{ classify.VALUE }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label class="product_quality">Chất lượng sản phẩm</label>
              <div class="">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['bi', n <= item.rating ? 'bi-star-fill' : 'bi-star']"
                  @click="item.rating = n"
                  style="color: gold; cursor: pointer; font-size: 25px"
                ></i>
              </div>
              <div class="px-3">
                <small v-if="item.rating === 5" class="text-warning text-rating"
                  >Tuyệt vời</small
                >
                <small v-if="item.rating === 4" class="text-warning text-rating"
                  >Hài lòng</small
                >
                <small
                  v-if="item.rating === 3"
                  class="text-secondary text-rating"
                  >Bình thường</small
                >
                <small
                  v-if="item.rating === 2"
                  class="text-secondary text-rating"
                  >Không hài lòng</small
                >
                <small
                  v-if="item.rating === 1"
                  class="text-secondary text-rating"
                  >Tệ</small
                >
              </div>
            </div>

            <div class="mb-3">
              <textarea
                class="form-control"
                id="reviewText"
                rows="5"
                placeholder="để lại đánh giá."
                v-model="item.desc_reviews"
              ></textarea>
            </div>

            <div class="mb-3">
              <button class="btn btn-outline-success me-2">
                <i class="bi bi-camera"></i> Thêm Hình ảnh
                <input
                  class="input-file"
                  type="file"
                  @change="UploadFile($event, item)"
                  multiple
                />
              </button>
              <div v-if="item.images && item.images.length > 0">
                <h5>Hình ảnh đã upload:</h5>
                <div class="uploaded-images">
                  <img
                    v-for="image in item.images"
                    :key="image._id"
                    :src="image.file_url"
                    alt="Uploaded Image"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer sticky-position">
            <button
              type="button"
              class="btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              TRỞ LẠI
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitRating()"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Hoàn Thành
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal đánh giá sp -->
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
          Chờ xác nhận
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
          Đang xử lý
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="sendProduct-tab"
          data-bs-toggle="pill"
          data-bs-target="#sendProduct"
          type="button"
          role="tab"
          aria-controls="sendProduct"
          aria-selected="false"
        >
          Đã gửi hàng
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
          id="cancel-tab"
          data-bs-toggle="pill"
          data-bs-target="#cancel"
          type="button"
          role="tab"
          aria-controls="cancel"
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
        <div class="wrap" v-for="item in orders" :key="item._id">
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
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
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
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end py-4" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span v-if="item.lastStatusCode === 4"
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button v-if="item.lastStatusCode < 4">Xác nhận hủy</button>
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
        <div class="wrap" v-for="item in pendingOrders" :key="item._id">
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
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
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
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end py-4" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button v-if="item.lastStatusCode < 4">Xác nhận hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-contact"
        role="tabpanel"
        aria-labelledby="pills-contact-tab"
      >
        <div class="wrap" v-for="item in confirmedOrders" :key="item._id">
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
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
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
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end py-4" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button v-if="item.lastStatusCode < 4">Xác nhận hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="sendProduct"
        role="tabpanel"
        aria-labelledby="sendProduct-tab"
      >
        <div class="wrap" v-for="item in processingOrders" :key="item._id">
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
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
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
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end py-4" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button v-if="item.lastStatusCode < 4">Xác nhận hủy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="success-order"
        role="tabpanel"
        aria-labelledby="success-order-tab"
      >
        <div class="wrap" v-for="item in completedOrders" :key="item._id">
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
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
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
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#ratingModal"
                  @click="getOrderSuccessById(item._id)"
                >
                  Đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VPagination
      v-model="page"
      :pages="currentMaxPage"
      :range-size="5"
      active-color="#DCEDFF"
      @update:modelValue="onPageChange"
    />
  </div>
</template>

<script>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import { formatNumber } from "@/utils/formatNumber";
import reviewServices from "@/services/review.services";
import uploadServices from "@/services/upload.services";
export default {
  components: {
    VPagination,
  },
  data() {
    return {
      orders: [],
      orderSuccess: [],
      reviewId: "",
      rating: 0,
      reviewContent: "",
      orderDataRating: null,
      page: 1,
      limit: 5,
      currentMaxPage: 1,
    };
  },
  created() {
    this.getOrder();
    this.getOrderSuccess();
  },
  computed: {
    // Filter orders by status
    allOrders() {
      return this.orders;
    },
    pendingOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 1
      );
    },
    confirmedOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 3
      );
    },
    processingOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 4
      );
    },
    completedOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 6
      );
    },
    cancelledOrders() {
      return this.orders.filter((order) => order.CANCEL_REASON !== null);
    },
  },

  methods: {
    async getOrder() {
      const order = await orderServices.getOrderUser(this.page, this.limit);
      // Sau khi lấy danh sách đơn hàng, gọi API để lấy tên sản phẩm
      for (const item of order.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.orders = order.data;
      for (const item of this.orders) {
        const response = await orderServices.getLastStatusOrder(item._id);

        item.lastStatusCode = response.data;
      }
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
      console.log("sản phẩm đã thanh toán", this.orderSuccess);
    },
    async getOrderSuccessById(id) {
      const response = await orderServices.getOrderById(id);
      for (const item of response.data.LIST_PRODUCT) {
        const NAME_PRODUCT = await this.getNameProduct(item.ID_PRODUCT);
        item.NAME_PRODUCT = NAME_PRODUCT;
        item.rating = 0;
        item.desc_reviews = "";
        item.classify = item.LIST_MATCH_KEY.map((key) => key.VALUE).join(", "); // Ghép các giá trị phân loại thành chuỗi
      }
      this.orderDataRating = response.data;
      console.log("dữ liệu trả về lấy đánh giá", this.orderDataRating);
    },
    async getNameProduct(id) {
      const response = await productServices.getById(id);

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
    setRating(n, item) {
      item.rating = n;
    },
    async UploadFile(event, item) {
      const files = Array.from(event.target.files);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("imgs", file);
        });
        const response = await uploadServices.uploadFiles(formData);
        const uploadedImages = response.data.map((file) => ({
          file_url: file.url,
          file_type: file.type,
        }));
        if (!item.images) {
          item.images = []; // Khởi tạo mảng nếu chưa có
        }
        item.images.push(...uploadedImages); // Thêm các hình ảnh vào mảng images của sản phẩm
      } catch (error) {
        console.error(error);
      }
    },
    async receivedProduct(id_account, id_order) {
      const payload = {
        id_order: id_order,
      };
      try {
        await orderServices.receivedGoods(id_account, payload);

        this.getOrder();
      } catch (error) {
        console.error(error);
      }
    },
    async submitRating() {
      if (!this.orderDataRating) return;

      const reviews = this.orderDataRating.LIST_PRODUCT.map((item) => ({
        ID_PRODUCT: item.ID_PRODUCT,
        id_account_shop: this.orderDataRating.ACCOUNT__ID,
        number_start: item.rating,
        desc_reviews: item.desc_reviews,
        img_url: item.images.map((img) => img.file_url),
        classify: item.classify,
      }));
      try {
        for (const review of reviews) {
          const payload = {
            number_start: review.number_start,
            desc_reviews: review.desc_reviews,
            img_url: review.img_url,
            classify: review.classify,
            id_account_shop: review.id_account_shop,
          };
          // Gọi API với ID_PRODUCT và payload trong vòng lặp
          const response = await reviewServices.AddReviews(
            review.ID_PRODUCT,
            payload
          );
          console.log(
            "Dữ liệu đánh giá gửi thành công cho sản phẩm",
            review.ID_PRODUCT,
            response
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.background-component {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.background-height {
  min-height: 700px;
}

/* Navigation Pills Styling */
.nav-pills {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
}

.nav-pills .nav-link {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.nav-pills .nav-link.active {
  background: #09884d;
  color: #fff;
  box-shadow: 0 2px 6px rgba(9, 136, 77, 0.2);
}

/* Order Item Styling */
.wrap {
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.wrap:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.title-order {
  padding: 15px 20px;
  border-bottom: 1px solid #eef0f2;
}

.title-order span {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.show-shop {
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.show-shop:hover {
  background: #f8f9fa;
  border-color: #09884d;
  color: #09884d;
}

/* Product Details */
.img_name_product {
  padding: 15px 20px;
}

.img img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eef0f2;
  transition: all 0.3s ease;
}

.img img:hover {
  transform: scale(1.05);
}

.name {
  padding: 0 15px;
}

.name span {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.4;
}

.classify {
  color: #666;
  font-size: 13px;
  margin: 8px 0;
}

.price_product span {
  color: #09884d;
  font-weight: 600;
  font-size: 16px;
}

/* Order Footer */
.footer-order {
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 0 0 10px 10px;
}

.total-price {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.total-price span:first-child {
  color: #666;
  font-size: 14px;
}

.total-price span:last-child {
  color: #09884d;
  font-size: 20px;
  font-weight: 600;
}

.notification {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.notification span {
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  flex: 1;
}

.confirm {
  display: flex;
  gap: 10px;
  padding-left: 20px;
}

.confirm button {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.confirm button:nth-child(1) {
  background: #09884d;
  color: white;
}

.confirm button:nth-child(2) {
  background: #dc3545;
  color: white;
}

.confirm button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Rating Modal */
.modal-content {
  border-radius: 12px;
  border: none;
}

.modal-header {
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.text-title {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.uploaded-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.uploaded-images img {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.uploaded-images img:hover {
  transform: scale(1.05);
}

/* Star Rating */
.bi {
  transition: all 0.3s ease;
}

.bi-star-fill {
  color: #ffd700;
  transform: scale(1.1);
}

.text-rating {
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
}

/* Input File Button */
.btn-outline-success {
  position: relative;
  overflow: hidden;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-outline-success:hover {
  background: #09884d;
  color: white;
}

.input-file {
  cursor: pointer;
}

/* Animation */
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

.wrap {
  animation: fadeIn 0.3s ease;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .nav-pills {
    flex-wrap: wrap;
  }

  .nav-pills .nav-link {
    width: 100%;
    text-align: center;
  }

  .notification {
    flex-direction: column;
    gap: 15px;
  }

  .confirm {
    padding-left: 0;
    width: 100%;
  }

  .confirm button {
    width: 100%;
  }
}
</style>
